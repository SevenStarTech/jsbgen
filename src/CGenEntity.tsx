import React, { useEffect, useState } from 'react';
import { CGenColumn } from './CGenTypes';
import c from './CGenUtil';
import Button from './components/button/Button';
import CGenDisplay from './CGenDisplay';

const CGenEntity = ({
  table,
  entity,
  columns,
  rootApi,
  api,
  pkg,
  parents,
  uncles,
  kids,
  includedKids,
}: {
  table: string;
  entity: string;
  columns: CGenColumn[];
  rootApi: string;
  api: string;
  pkg: string;
  parents: string;
  uncles: string;
  kids: string;
  includedKids: string;
}): JSX.Element => {
  const [code, setCode] = useState('');

  const camEntity = c.camelCase(entity);
  const capEntity = c.capitalCase(entity);

  useEffect(() => {
    let newCode = '';
    if (columns && columns.length > 0) {
      newCode = `package ${c.super_root()}${pkg}.entity;

import ${c.super_root()}.entity.BaseEntity;
import lombok.*;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;

@Entity
@Table(name = "${table}", uniqueConstraints = {@UniqueConstraint(columnNames = {"id", "tenant_id"})})
@Getter
@Setter
@Builder
@Audited
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ${capEntity}Entity extends BaseEntity {
`;
      newCode += columns
        .map(col => {
          let s = '';
          if (!c.isAuditColumn(col.column_name) && col.column_name !== 'id') {
            let colParentFound = c.isIdForParent(col.column_name, parents);
            let colUncleFound = c.isIdForParent(col.column_name, uncles);

            if (colParentFound.found) {
              //------------------------------------------------
              // an id pointing to a parent
              //------------------------------------------------
              let pte = c.splitPackageTableEntity(colParentFound.parent);
              s += `  @ManyToOne
    @JoinColumn(name = "${c.camelCase(pte.table)}_id")
    @EqualsAndHashCode.Exclude
    private ${c.capitalCase(pte.table)}Entity ${c.camelCase(pte.table)};`;
              s += '\n\n';
            } else if (colUncleFound.found) {
              //------------------------------------------------
              // an id pointing to a foreign key
              //------------------------------------------------
              let pte = c.splitPackageTableEntity(colUncleFound.parent);
              s = `  @OneToOne
    @JoinColumn(name = "${pte.camEntity}_id")
    private ${c.capitalCase(pte.table)}Entity ${c.camelCase(pte.table)};`;
              s += '\n\n';
            } else {
              //------------------------------------------------
              // a normal column
              //------------------------------------------------
              if (
                col.primary === 'YES' ||
                col.column_name === 'tenant_id' ||
                col.is_nullable === 'NO'
              ) {
                s = `${c.getNotEmptyText(col, false)}  @Column(name = "${
                  col.column_name
                }", nullable = false)
  private ${c.getColumnType(col.udt_name, col.column_name)} ${c.camelCase(
                  col.column_name,
                )};`;
              } else {
                s = `  @Column(name = "${col.column_name}")
  private ${c.getColumnType(col.udt_name, col.column_name)} ${c.camelCase(
                  col.column_name,
                )};`;
              }
              s += '\n\n';
              return s;
            }
          }
        })
        .join('');

      if (kids) {
        newCode += kids
          .split(',')
          .map(kid => {
            let s = '';
            let pte = c.splitPackageTableEntity(kid);
            s = `  @OneToMany(mappedBy = "${table}", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  //@JoinColumn(name="${camEntity}_id", referencedColumnName="id")
  @NotAudited
  private List<${c.capitalCase(pte.entity)}Entity> ${c.camelCase(
              pte.entity,
            )} = new ArrayList<>();`;
            s += '\n\n';
            return s;
          })
          .join('');
      }

      if (parents) {
        newCode += parents
          .split(',')
          .map(parent => {
            let s = '';
            let pte = c.splitPackageTableEntity(parent);
            s = `  @ManyToOne
  @JoinColumn(name = "${c.camelCase(pte.table)}_id")
  @EqualsAndHashCode.Exclude
  private ${c.capitalCase(pte.table)}Entity ${c.camelCase(pte.table)};`;
            s += '\n\n';
            return s;
          })
          .join('');
      }

      if (uncles) {
        newCode += uncles
          .split(',')
          .map(uncle => {
            let s = '';
            let pte = c.splitPackageTableEntity(uncle);
            s = `  @OneToOne
  @JoinColumn(name = "${pte.camEntity}_id")
  private ${c.capitalCase(pte.table)}Entity ${c.camelCase(pte.table)};`;
            s += '\n\n';
            return s;
          })
          .join('');
      }

      newCode += `}`;
    }
    setCode(newCode);
  });

  return <CGenDisplay entity={entity} fileEnding="entity" code={code} />;
};

export default CGenEntity;