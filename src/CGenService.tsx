import React, { useEffect, useState } from 'react';
import { CGenColumn, CGenParent } from './CGenTypes';
import c from './CGenUtil';
import Button from './components/button/Button';
import CGenDisplay from './CGenDisplay';

const CGenService = ({
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
      newCode = `package ${c.super_root()}${pkg}.service;

import ${c.super_root()}.exceptions.RelatedResourceNotFoundException;
import ${c.super_root()}.mapper.DozerMapper;
import ${c.super_root()}${pkg}.entity.*;
import ${c.super_root()}${pkg}.model.*;
import ${c.super_root()}${pkg}.helper.*;
import ${c.super_root()}${pkg}.repository.*;
import ${c.super_root()}.exceptions.ResourceNotFoundException;
import ${c.super_root()}.exceptions.ResourceNotFoundException.*;
import ${c.super_root()}.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;


import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Validated
public class ${capEntity}Service {
          
  private final SecurityUtils securityUtils;
  private final ${c.capitalCase(
    c.replaceDotsWithDashes(pkg),
  )}Helper ${c.camelCase(c.replaceDotsWithDashes(pkg))}Helper;
`;
      if (kids) {
        newCode += kids
          .split(',')
          .map(kid => {
            let s = '';
            let pte = c.splitPackageTableEntity(kid);
            s = `  private final ${c.capitalCase(pte.table)}Repository ${
              pte.camEntity
            }Repository;`;
            s += '\n';
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
            s = `  private final ${c.capitalCase(pte.table)}Repository ${
              pte.camEntity
            }Repository;`;
            s += '\n';
            return s;
          })
          .join('');
      }

      newCode += `  private final ${capEntity}Repository ${camEntity}Repository;\n`;

      newCode += `  private final DozerMapper dozerMapper;\n\n`;

      //---------------------------------------
      // GET PARAMETER LIST BASED ON PARENTS
      //---------------------------------------
      let list = '';
      let listWithType = '';
      let params = '';
      if (parents) {
        parents.split(',').map(parent => {
          let pte = c.splitPackageTableEntity(parent);
          if (params) {
            params += ',\n';
          }
          params += `      @NotBlank(message = "${c.humanCase(
            pte.entity,
          )} Id cannot be null or empty.") String ${pte.camEntity}Id`;

          if (list) {
            list += ', ';
            listWithType += ', ';
          }
          list += `${pte.camEntity}Id`;
          listWithType += `String ${pte.camEntity}Id`;

          return '';
        });
      }
      let paramsFull = params;
      if (paramsFull) {
        paramsFull += ',\n';
      }
      paramsFull += `      @NotBlank(message = "${c.humanCase(
        entity,
      )} Id cannot be null or empty.") String ${camEntity}Id`;

      let listFull = list;
      if (listFull) {
        listFull += ', ';
      }
      listFull += `${camEntity}Id`;

      //     //---------------------------------------
      //     // GET A SINGLE ENTITY
      //     //---------------------------------------
      //     newCode += `  public ${capEntity} get${capEntity}(String ${camEntity}Id) {

      //   ${capEntity}Entity ${camEntity}Entity = ${camEntity}Repository.findById(${camEntity}Id)
      //               .orElseThrow(() -> new ResourceNotFoundException(ResourceType.${c
      //                 .capitalCase(entity)
      //                 .toUpperCase()}, ${camEntity}Id));
      //   return dozerMapper.convert(${camEntity}Entity, ${capEntity}.class);
      // }\n\n`;

      //     //---------------------------------------
      //     // GET ALL ENTITIES
      //     //---------------------------------------
      //     newCode += `  public List<${capEntity}> get${capEntity}s() {

      //   List<${capEntity}Entity> ${camEntity}Entities = ${camEntity}Repository.findAll();
      //   return dozerMapper.convertAsList(${camEntity}Entities, ${capEntity}.class);
      // }\n\n`;

      //---------------------------------------
      // GET A ENTITY FOR PARENT(S)
      //---------------------------------------
      if (parents) {
        newCode += `  public ${capEntity} get${capEntity}(\n${paramsFull}) {\n\n`;

        newCode += `        ${capEntity}Entity ${camEntity}Entity = ${c.camelCase(
          c.replaceDotsWithDashes(pkg),
        )}Helper.getUnavailableEquipmentEntity(${listFull});
          return dozerMapper.convert(${camEntity}Entity, ${capEntity}.class);
        }\n\n`;
      }

      // EXPERIMENTAL ... WORKS FOR A SINGLE PARENT ONLY
      //---------------------------------------
      // GET ALL ENTITIES FOR PARENT(S)
      //---------------------------------------
      if (parents) {
        newCode += `  public List<${capEntity}> get${capEntity}s(\n${params}) {\n\n`;

        let lastParent: CGenParent | undefined = undefined;

        newCode += parents
          .split(',')
          .map(parent => {
            let pte = c.splitPackageTableEntity(parent);
            lastParent = pte;
            return `${pte.capEntity}Entity ${pte.camEntity}Entity = ${
              pte.camEntity
            }Repository.findById(${pte.camEntity}Id)
        .orElseThrow(() -> new ResourceNotFoundException(ResourceType.${pte.capEntity.toUpperCase()}, ${
              pte.camEntity
            }Id));\n\n`;
          })
          .join('');

        if (lastParent) {
          newCode += `        List<${capEntity}Entity> ${camEntity}Entities = ${
            (lastParent as CGenParent).camEntity
          }Entity.getUnavailableEquipment();
          return dozerMapper.convertAsList(${camEntity}Entities, ${capEntity}.class);
        }\n\n`;
        }
      }

      //---------------------------------------
      // CREATE ENTITY
      //---------------------------------------
      newCode += `  public ${capEntity} create${capEntity}(\n${
        params ? params + ',\n' : ''
      }
      @Valid ${capEntity}CreateRequest request) {\n\n`;

      if (parents) {
        newCode +=
          parents
            .split(',')
            .map(parent => {
              let s = '';
              let pte = c.splitPackageTableEntity(parent);
              if (s) {
                s += ', ';
              }
              s += `    ${pte.capEntity}Entity ${
                pte.camEntity
              }Entity = ${c.camelCase(pte.entity)}Repository.findById(${
                pte.camEntity
              }Id)
          .orElseThrow(() -> new ResourceNotFoundException(ResourceType.${c
            .camelCase(pte.entity)
            .toUpperCase()}, ${pte.camEntity}Id));\n`;
              return s;
            })
            .join('') + '\n';
      }

      newCode += `    ${capEntity}Entity ${camEntity}Entity = ${capEntity}Entity.builder()\n`;

      if (parents) {
        newCode += parents
          .split(',')
          .map(parent => {
            let s = '';
            let pte = c.splitPackageTableEntity(parent);
            s += `    .${pte.camEntity}(${pte.camEntity}Entity)\n`;
            return s;
          })
          .join('');
      }

      newCode += columns
        .map(col => {
          let s = '';
          if (
            col.column_name.toLowerCase() !== 'id' &&
            !c.isIdForParent(col.column_name, parents).found &&
            (c.camelCase(col.column_name) === 'tenantId' ||
              col.column_name.toLowerCase().indexOf('id') === -1) &&
            !c.isAuditColumn(col.column_name)
          ) {
            if (c.camelCase(col.column_name) === 'tenantId') {
              s += `      .tenantId(securityUtils.getCurrentTenant())\n`;
            } else {
              s += `      .${c.camelCase(
                col.column_name,
              )}(request.get${c.capitalCase(col.column_name)}())\n`;
            }
          }
          return s;
        })
        .join('');

      newCode += `      .build();\n\n`;

      newCode += `    ${camEntity}Entity = ${camEntity}Repository.save(${camEntity}Entity);

    return dozerMapper.convert(${camEntity}Entity, ${capEntity}.class);
  }\n\n`;

      //---------------------------------------
      // UPDATE ENTITY
      //---------------------------------------
      newCode += `  public ${capEntity} update${capEntity}(
`;
      newCode += paramsFull;
      newCode += `,\n`;
      newCode += `      @Valid ${capEntity}UpdateRequest request) {

    ${capEntity}Entity ${camEntity}Entity = ${c.camelCase(
        c.replaceDotsWithDashes(pkg),
      )}Helper.get${capEntity}Entity(${listFull});\n\n`;

      newCode += columns
        .map(col => {
          let s = '';
          if (
            col.column_name.toLowerCase() !== 'id' &&
            !c.isIdForParent(col.column_name, parents).found &&
            col.column_name.toLowerCase().indexOf('id') === -1 &&
            !c.isAuditColumn(col.column_name)
          ) {
            s = `    ${camEntity}Entity.set${c.capitalCase(
              col.column_name,
            )}(request.get${c.capitalCase(col.column_name)}());`;
            s += '\n';
          }
          return s;
        })
        .join('');

      newCode += '\n';
      newCode += `    ${camEntity}Repository.save(${camEntity}Entity);

    return dozerMapper.convert(${camEntity}Entity, ${capEntity}.class);
  }\n\n`;

      //---------------------------------------
      // DELETE ENTITY
      //---------------------------------------
      newCode += `  public void delete${capEntity}(\n${paramsFull}`;
      newCode += `) {

    ${capEntity}Entity ${camEntity}Entity = ${c.camelCase(
        c.replaceDotsWithDashes(pkg),
      )}Helper.get${capEntity}Entity(${listFull});
    ${camEntity}Repository.delete(${camEntity}Entity);

  }`;

      newCode += `\n}`;
      setCode(newCode);
    }
  });
  return <CGenDisplay entity={entity} fileEnding="service" code={code} />;
};

export default CGenService;