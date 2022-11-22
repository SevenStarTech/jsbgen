import React, { useEffect, useState } from 'react';
import { CGenColumn } from './CGenTypes';
import c from './CGenUtil';
import Button from './components/button/Button';
import CGenDisplay from './CGenDisplay';

const CGenResponse = ({
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
      newCode = `package ${c.super_root()}${pkg}.model;

import com.github.dozermapper.core.Mapping;
`;

      if (parents) {
        newCode += parents
          .split(',')
          .map(parent => {
            let s = '';
            let pte = c.splitPackageTableEntity(parent);
            s =
              `import ` +
              c.super_root() +
              `.${c.camelCase(pte.basepkg)}.model.${c.capitalCase(pte.table)};`;
            s += '\n';
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
            s =
              `import ` +
              c.super_root() +
              `.${c.camelCase(pte.basepkg)}.model.${c.capitalCase(pte.table)};`;
            s += '\n';
            return s;
          })
          .join('');
      }

      newCode += `
import lombok.*;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ${capEntity} {
`;
      newCode += columns
        .map(col => {
          let s = '';
          if (!c.isAuditColumn(col.column_name)) {
            s = `  private ${c.getColumnType(
              col.udt_name,
              col.column_name,
            )} ${c.camelCase(col.column_name)};`;
            s += '\n';

            if (
              col.column_name.toLowerCase().indexOf('price') >= 0 ||
              col.column_name.toLowerCase().indexOf('cost') >= 0
            ) {
              // output a version of this in cents
              s += '\n';
              s += `  @Getter(AccessLevel.NONE)
  private BigInteger ${c.camelCase(col.column_name)}InCents;

  public BigInteger get${c.capitalCase(col.column_name)}InCents() {
      if (${c.camelCase(col.column_name)} == null) {
          return null;
      }
      return ${c.camelCase(
        col.column_name,
      )}.multiply(BigDecimal.valueOf(100)).toBigInteger();
  }`;
              s += '\n\n';
            }

            return s;
          }
        })
        .join('');

      if (includedKids) {
        newCode += includedKids
          .split(',')
          .map(kid => {
            let s = '';
            let pte = c.splitPackageTableEntity(kid);
            s = `  private List<${c.capitalCase(pte.entity)}> ${c.camelCase(
              pte.entity,
            )}s;`;
            s += '\n\n';
            return s;
          })
          .join('');
      }

      newCode += `}`;
    }
    setCode(newCode);
  });
  return <CGenDisplay entity={entity} fileEnding="" code={code} />;
};

export default CGenResponse;