import React, { useEffect, useState } from 'react';
import { CGenColumn } from './CGenTypes';
import c from './CGenUtil';
import Button from './components/button/Button';
import CGenDisplay from './CGenDisplay';

const CGenUpdateRequest = ({
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
  forCreate = false,
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
  forCreate?: boolean;
}): JSX.Element => {
  const [code, setCode] = useState('');

  const camEntity = c.camelCase(entity);
  const capEntity = c.capitalCase(entity);

  useEffect(() => {
    let newCode = '';
    if (columns && columns.length > 0) {
      newCode = `package ${c.super_root()}${pkg}.model;

import ${c.super_root()}.annotations.CheckEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.OffsetTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ${capEntity}${forCreate ? 'Create' : 'Update'}Request {
`;
      newCode += columns
        .map(col => {
          let s = '';
          if (
            col.column_name.toLowerCase() !== 'id' &&
            !c.isIdForParent(col.column_name, parents).found &&
            (forCreate || col.column_name.toLowerCase().indexOf('id') === -1) &&
            !c.isAuditColumn(col.column_name) &&
            col.column_name !== 'tenant_id'
          ) {
            if (col.primary === 'YES' || col.is_nullable === 'NO') {
              s = `${c.getNotEmptyText(col, true)}  private ${c.getColumnType(
                col.udt_name,
                col.column_name,
              )} ${c.camelCase(col.column_name)};`;
            } else {
              s = `  private ${c.getColumnType(
                col.udt_name,
                col.column_name,
              )} ${c.camelCase(col.column_name)};`;
            }
            s += '\n';
            return s;
          }
        })
        .join('');

      newCode += `}`;
    }
    setCode(newCode);
  });
  return (
    <CGenDisplay
      entity={entity}
      fileEnding={forCreate ? 'create_request' : 'update_request'}
      code={code}
    />
  );
};

export default CGenUpdateRequest;