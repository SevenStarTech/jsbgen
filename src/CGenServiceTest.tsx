// prettier-ignore-end

import React, { useEffect, useState } from 'react';
import { CGenColumn, CGenParent } from './CGenTypes';
import c from './CGenUtil';
import Button from './components/button/Button';
import CGenDisplay from './CGenDisplay';

const CGenServiceTest = ({
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

  let colAssign = ['', '', '']; // index 0 is not used
  let colTuple = ['', '', '']; // index 0 is not used
  let colList = '';
  let requiredColSets = '';
  let requiredColList = '"id"';
  let requiredColChecks = '';

  if (columns.length > 0) {
    columns.map(col => {
      if (!c.isAuditColumn(col.column_name) && col.column_name !== 'id') {
        let colParentFound = c.isIdForParent(col.column_name, parents);
        let colUncleFound = c.isIdForParent(col.column_name, uncles);

        if (colParentFound.found) {
          //------------------------------------------------
          // an id pointing to a parent
          //------------------------------------------------
        } else if (colUncleFound.found) {
          //------------------------------------------------
          // an id pointing to a foreign key
          //------------------------------------------------
        } else {
          //------------------------------------------------
          // a normal column
          //------------------------------------------------
          let colName = c.camelCase(col.column_name);
          if (colList) {
            colList += ', ';
          }
          colList += `"${colName}"`;

          if (colTuple[1]) {
            colTuple[1] += ', ';
            colTuple[2] += ', ';
          }
          colTuple[1] += `${camEntity}Entity1.get${c.capitalCase(
            col.column_name,
          )}()`;
          colTuple[2] += `${camEntity}Entity2.get${c.capitalCase(
            col.column_name,
          )}()`;

          colAssign[1] += `                .${colName}(${c.getTestData(
            col,
            1,
          )})\n`;
          colAssign[2] += `                .${colName}(${c.getTestData(
            col,
            2,
          )})\n`;
        }

        // now build the list of required column setters
        if (
          col.column_name.toLowerCase() !== 'id' &&
          !c.isIdForParent(col.column_name, parents).found &&
          (forCreate || col.column_name.toLowerCase().indexOf('id') === -1) &&
          !c.isAuditColumn(col.column_name) &&
          col.column_name !== 'tenant_id'
        ) {
          if (col.primary === 'YES' || col.is_nullable === 'NO') {
            requiredColSets += `                .${
              col.column_name
            }(${c.getTestData(col, 1)})\n`;
            requiredColList += `, "${col.column_name}"`;
            requiredColChecks += `          assertThat(created${capEntity}.get${c.capitalCase(
              col.column_name,
            )}()).isNotNull();\n`;
          }
        }
      }
    });
  }

  colTuple[1] = `tuple(${camEntity}Id1, ${colTuple[1]}),`;
  colTuple[2] = `tuple(${camEntity}Id2, ${colTuple[2]})`;

  useEffect(() => {
    let newCode = '';
    if (columns && columns.length > 0) {
      newCode = `package ${c.super_root()}${pkg}.service;

import ${c.super_root()}.exceptions.ResourceNotFoundException;
import ${c.super_root()}.mapper.DozerMapper;
import ${c.super_root()}${pkg}.entity.*;
import ${c.super_root()}${pkg}.model.*;
import ${c.super_root()}${pkg}.repository.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.time.LocalDate;
import java.time.OffsetTime;
import java.util.ArrayList;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.when;

@RunWith(SpringJUnit4ClassRunner.class)
public class ${capEntity}ServiceTest {

    @InjectMocks
    private ${capEntity}Service ${camEntity}Service;

    @Mock
    private ${capEntity}Repository ${camEntity}Repository;

    @Spy
    private DozerMapper dozerMapper;

    @Test
    public void get${capEntity}s_When${capEntity}sExists_ReturnListOf${capEntity}s() {\n\n`;

      for (let idx = 1; idx <= 2; idx++) {
        newCode +=
          `        String ${camEntity}Id${idx} = UUID.randomUUID().toString();
        ${capEntity}Entity ${camEntity}Entity${idx} = ${capEntity}Entity.builder()
` +
          colAssign[idx] +
          `                .build();
        ${camEntity}Entity${idx}.setId(${camEntity}Id${idx});\n\n`;
      }

      newCode += `
        when(${camEntity}Repository.findAll()).thenReturn(List.of(
            ${camEntity}Entity1, ${camEntity}Entity2
        ));

        List<${capEntity}> ${camEntity}sList = ${camEntity}Service.get${capEntity}s();

        assertThat(${camEntity}sList).hasSize(2);
        assertThat(${camEntity}sList).extracting("id", ${colList})
                .containsExactly(
                        ${colTuple[1]}
                        ${colTuple[2]}
                );
    }          

    @Test
    public void get${capEntity}s_When${capEntity}sDontExists_ReturnEmptyListOf${capEntity}s() {
        when(${camEntity}Repository.findAll()).thenReturn(Collections.emptyList());

        List<${capEntity}> ${camEntity}sList = ${camEntity}Service.get${capEntity}s();

        assertThat(${camEntity}sList).isEmpty();
    }    

    @Test
    public void get${capEntity}ById_When${capEntity}Exists_Return${capEntity}() {

        String ${camEntity}Id = UUID.randomUUID().toString();

        ${capEntity}Entity ${camEntity}Entity = ${capEntity}Entity.builder()
                ${colAssign[1]}.build();
                ${camEntity}Entity.setId(${camEntity}Id);

        when(${camEntity}Repository.findById(${camEntity}Id)).thenReturn(Optional.of(${camEntity}Entity));

        ${capEntity} ${camEntity}ById = ${camEntity}Service.get${capEntity}(${camEntity}Id);

        assertThat(${camEntity}ById.getId()).isEqualTo(${camEntity}Entity.getId());
    }

    @Test
    public void get${capEntity}ById_When${capEntity}DoesNotExist_ThrowResourceNotFound() {
        String ${camEntity}Id = UUID.randomUUID().toString();
        when(${camEntity}Repository.findById(${camEntity}Id)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> ${camEntity}Service.get${capEntity}(${camEntity}Id))
                .isExactlyInstanceOf(ResourceNotFoundException.class)
                .extracting("resourceType", "resourceId")
                .containsExactly(ResourceNotFoundException.ResourceType.${capEntity.toUpperCase()}, ${camEntity}Id);
    }\n\n`;

      if (parents) {
        newCode += `    @Test
    public void create${capEntity}_givenParentsExist_returnCreated${capEntity}() {
        // GIVEN: parents exist
        String generated${capEntity}Id = UUID.randomUUID().toString();
        ${capEntity} expected${capEntity} = ${capEntity}.builder()
                .id(generated${capEntity}Id)
${colAssign[1]}                .build();\n\n`;

        let restOfParents = parents.split(',');
        let firstParent = String(restOfParents.shift());
        let firstPte = c.splitPackageTableEntity(firstParent);

        // NOW CREATE INTERMEDIARY PARENTS
        restOfParents = restOfParents.reverse();
        let prevParent: CGenParent | undefined;
        if (restOfParents) {
          newCode += restOfParents
            .map(parent => {
              let s = '';
              let pte = c.splitPackageTableEntity(parent);
              s += `        String generated${pte.capEntity}Id = UUID.randomUUID().toString();
        ${pte.capEntity}Entity ${pte.camEntity}Entity = ${pte.capEntity}Entity.builder()
                .id(generated${pte.capEntity}Id)\n`;
              if (prevParent) {
                // previous parent exists, so put it in as a child
                s += `                .${prevParent.camEntity}s(singletonList(${prevParent.camEntity}Entity))\n`;
              } else {
                // first one, so use our main entity as a child
                s += `                .${camEntity}s(singletonList(${camEntity}Entity))\n`;
              }
              s += `                .build();
        ${pte.camEntity}Entity.setId(generated${pte.capEntity}Id);`;
              prevParent = pte;
              return s;
            })
            .join('');
        }

        //CREATE FIRST PARENT
        newCode += '\n\n';
        newCode += `        String generated${firstPte.capEntity}Id = UUID.randomUUID().toString();
        ${firstPte.capEntity}Entity ${firstPte.camEntity}Entity = ${firstPte.capEntity}Entity.builder()
                .id(generated${firstPte.capEntity}Id)\n`;
        if (prevParent) {
          newCode += `                .${prevParent.camEntity}s(singletonList(${prevParent.camEntity}Entity))\n`;
        } else {
          newCode += `                .${camEntity}s(singletonList(${camEntity}Entity))\n`;
        }
        newCode += `                .build();

        when(${firstPte.camEntity}Repository.findById(generated${firstPte.capEntity}Id)).thenReturn(Optional.of(${firstPte.camEntity}Entity));
        when(${firstPte.camEntity}Repository.save(any(${firstPte.capEntity}Entity.class))).thenAnswer(invocation -> {
            ${capEntity}Entity ${camEntity}Entity = ${firstPte.camEntity}Entity`;

        // now get the rest of the parents in a chain until we can get the entity we are testing
        newCode += restOfParents
          .map(parent => {
            let pte = c.splitPackageTableEntity(parent);
            return `.get${pte.capEntity}s().get(0)`;
          })
          .join('');

        newCode += `.get${capEntity}s().get(0);
            ${camEntity}Entity.setId(generated${capEntity}Id);
            return ${firstPte.camEntity}Entity;
        });\n\n`;

        // get a list of our generated parent ids
        let parentIds = '';
        if (parents) {
          parents
            .split(',')
            .map(parent => {
              let pte = c.splitPackageTableEntity(parent);
              parentIds += `generated${pte.capEntity}Id, `;
            })
            .join('');
        }

        newCode += `        when(${camEntity}Repository.save(any(${capEntity}Entity.class))).thenReturn(${camEntity}Entity);\n\n`;

        // now run the test
        newCode += `        ${capEntity}CreateRequest ${camEntity}CreateRequest = ${capEntity}CreateRequest.builder()
${requiredColSets}                .build();
        // WHEN: create ${camEntity} request
        ${capEntity} created${capEntity} = ${camEntity}Service.create${capEntity}(${parentIds}create${capEntity}Request);

        // THEN: return created ${camEntity}
        assertThat(created${capEntity}).isEqualToComparingOnlyGivenFields(expected${capEntity}, ${requiredColList});
    }

    @Test
    public void create${capEntity}_givenPerentsDoNotExist_throwResourceNotFoundException() {
        // GIVEN: creating a ${camEntity} with parent(s)
        // WHEN: the parent(s) do not exist
        when(${
          firstPte.camEntity
        }Repository.findById("1")).thenReturn(Optional.empty());
        ${capEntity}CreateRequest ${camEntity}CreateRequest = ${capEntity}CreateRequest.builder()
                .id("2")
                .build();

        // THEN: throw error
        assertThatThrownBy(() -> ${
          firstPte.camEntity
        }Service.create${capEntity}("1", ${camEntity}CreateRequest))
                .isExactlyInstanceOf(ResourceNotFoundException.class)
                .extracting("resourceType", "resourceId").containsExactly(ResourceType.${firstPte.camEntity.toUpperCase()}, "1");
    }

}`;
      } else if (uncles) {
        // since there are no parents, but only foreign keys, lets test it this way

        // NOW CREATE FOREIGN KEY
        let declares = '';
        let checks = '';
        uncles.split(',').map(uncle => {
          let pte = c.splitPackageTableEntity(uncle);
          declares += `            String generated${pte.capEntity}Id = UUID.randomUUID().toString();
            {pte.capEntity}Entity ${pte.camEntity}Entity = {pte.capEntity}Entity.builder()
                    .${pte.camEntity}Id(generated${pte.capEntity}Id)
                    .build();        
            when(${pte.camEntity}Repository.findById(generated${pte.capEntity}Id)).thenReturn(Optional.of(${pte.camEntity}Entity));\n\n`;

          checks += `        assertThat(created${capEntity}.get${pte.capEntity}()).isNotNull();
            assertThat(created${capEntity}.get${pte.capEntity}().getId()).isEqualTo(generated${pte.capEntity}Id);\n\n`;
        });

        newCode += `    @Test
        public void create${capEntity}_givenValidForeignKeys_returnsNew${capEntity}() {
            String customerId = "12345";
            ${capEntity}.Status status = ${capEntity}.Status.DRAFT;
    
${declares}
    
            String generated${capEntity}Id = UUID.randomUUID().toString();

            ${capEntity}Entity ${camEntity}Entity = ${capEntity}Entity.builder()
${colAssign[1]}                .build();
            ${camEntity}Entity.setId(generated${capEntity}Id);
   
            when(${camEntity}Repository.save(any(${capEntity}Entity.class))).thenReturn(${camEntity}Entity);
    
            // GIVEN: valid foreign keys
            // WHEN: create${capEntity} is called
            ${capEntity} created${capEntity} = ${camEntity}Service.create${capEntity}(status, customerId);
    
            // THEN:
            assertThat(created${capEntity}.getId()).isNotNull();
            assertThat(created${capEntity}.getCreatedDate()).isNotNull();

${requiredColChecks}

${checks}            
        }\n`;
      }
    }
    setCode(newCode);
  });
  return <CGenDisplay entity={entity} fileEnding="service_test" code={code} />;
};

export default CGenServiceTest;