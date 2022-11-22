import React, { useEffect, useState } from 'react';
import { CGenColumn } from './CGenTypes';
import c from './CGenUtil';
import Button from './components/button/Button';
import CGenDisplay from './CGenDisplay';

const CGenHelper = ({
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
      newCode = `package ${c.super_root()}${pkg}.helper;

import ${c.super_root()}.exceptions.ResourceNotFoundException;
import ${c.super_root()}${pkg}.entity.*;
import ${c.super_root()}${pkg}.repository.${capEntity}Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;
import javax.validation.constraints.NotBlank;

@Component
@RequiredArgsConstructor
@Validated
public class ${c.capitalCase(c.replaceDotsWithDashes(pkg))}Helper {\n\n`;

      if (!parents) {
        newCode += `  private final ${capEntity}Repository ${camEntity}Repository;\n\n`;
      }

      newCode += `  public ${capEntity}Entity get${capEntity}Entity(`;

      let list = '';
      if (parents) {
        let params = '';
        parents.split(',').map(parent => {
          let pte = c.splitPackageTableEntity(parent);
          if (params) {
            params += ',\n      ';
          }
          params += `@NotBlank(message = "${c.humanCase(
            pte.entity,
          )} Id cannot be null or empty.") String ${pte.camEntity}Id`;

          if (list) {
            list += ',';
          }
          list += `${pte.camEntity}Id`;

          return '';
        });
        if (params) {
          params += ',\n      ';
        }
        newCode += params;
      }

      newCode += `@NotBlank(message = "${c.humanCase(
        entity,
      )} Id cannot be null or empty.") String ${camEntity}Id`;
      newCode += `) {\n`;

      if (parents) {
        let parentsArray = parents.split(',');
        if (parentsArray.length > 0) {
          let lastParent = parentsArray[parentsArray.length - 1];
          let pte = c.splitPackageTableEntity(lastParent);
          newCode += '\n';
          newCode +=
            `    ${pte.capEntity}Entity ${c.camelCase(pte.entity)}Entity = get${
              pte.capEntity
            }Entity(${list});` + '\n\n';
          newCode += `    return ${c.camelCase(
            pte.entity,
          )}Entity.get${capEntity}().stream()
            .filter(${camEntity} -> ${c.camelCase(
            entity,
          )}Id.equals(${c.camelCase(
            entity,
          )}.getId())).findFirst().orElseThrow(() -> new ResourceNotFoundException(ResourceNotFoundException.ResourceType.${camEntity.toUpperCase()}, ${c.camelCase(
            entity,
          )}Id));`;
        }
      }

      if (!parents) {
        newCode += '\n';
        newCode += `    return ${camEntity}Repository.findById(${camEntity}Id)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceNotFoundException.ResourceType.${camEntity.toUpperCase()}, ${camEntity}Id));\n`;
      }

      newCode += '\n';
      newCode += `  }`;
      newCode += '\n';
      newCode += `}`;
    }
    setCode(newCode);
  });
  return (
    <CGenDisplay
      entity={c.replaceDotsWithDashes(pkg)}
      fileEnding="helper"
      code={code}
    />
  );
};

export default CGenHelper;