import React, { useEffect, useState } from 'react';
import { CGenColumn } from './CGenTypes';
import c from './CGenUtil';
import CGenDisplay from './CGenDisplay';

const CGenController = ({
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
      //---------------------------------------
      // GET PARAMETER LIST BASED ON PARENTS
      //---------------------------------------
      let list = '';
      let listWithType = '';
      let mapping = '';
      let params = '';
      if (parents) {
        parents.split(',').map(parent => {
          let pte = c.splitPackageTableEntity(parent);

          if (params) {
            params += ',\n';
          }
          params += `            @PathVariable(name = "${pte.camEntity}Id") String ${pte.camEntity}Id`;

          if (list) {
            list += ', ';
            listWithType += ', ';
          }
          list += `${pte.camEntity}Id`;
          listWithType += `String ${pte.camEntity}Id`;

          mapping += `/${pte.camEntity}s/{${pte.camEntity}Id}`;

          return '';
        });
      }
      let paramsFull = params;
      if (paramsFull) {
        paramsFull += ',\n';
      }
      paramsFull += `            @PathVariable(name = "${camEntity}Id") String ${camEntity}Id`;

      let listFull = list;
      if (listFull) {
        listFull += ', ';
      }
      listFull += `${camEntity}Id`;

      let mappingFull = mapping + `/{${camEntity}Id}`;

      //@RequestMapping("${mapping}${c.camelCase(api).toLowerCase()}")
      newCode = `package ${c.super_root()}${pkg}.controller;

import ${c.super_root()}.exceptions.ApiError;
import ${c.super_root()}.exceptions.ResourceNotFoundException;
import ${c.super_root()}.mapper.DozerMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.util.List; 

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import ${c.super_root()}${pkg}.model.*;
import ${c.super_root()}${pkg}.service.${capEntity}Service;

@Slf4j
@RestController
@RequestMapping("${rootApi}${mapping}")
@RequiredArgsConstructor
@SuppressWarnings("squid:S1192")
public class ${capEntity}Controller {

private final ${capEntity}Service ${camEntity}Service;
private final DozerMapper dozerMapper;\n\n`;

    //---------------------------------------
    // GET ALL ROWS CONTROLLER
    //---------------------------------------
    newCode += `  @GetMapping${api ? '("' + api + '")' : ''}
public ResponseEntity<List<${capEntity}>> get${capEntity}s(${
        params ? '\n' + params : ''
    }) {
    List<${capEntity}> ${camEntity}s = ${camEntity}Service.get${capEntity}s(${list});
    return ResponseEntity.ok(${camEntity}s); 
}\n\n`;

    //---------------------------------------
    // GET SINGLE ROW CONTROLLER
    //---------------------------------------
    newCode += `  @GetMapping("${api}/{${camEntity}Id}")
public ResponseEntity<${capEntity}> get${capEntity}(${
        paramsFull ? '\n' + paramsFull : ''
    }) {
    ${capEntity} ${camEntity} = ${camEntity}Service.get${capEntity}(${listFull});
    return ResponseEntity.ok(${camEntity});
}\n\n`;

    //---------------------------------------
    // CREATE AN ENTITY
    //---------------------------------------
    newCode += `  @PostMapping${api ? '("' + api + '")' : ''}
public ResponseEntity create${capEntity}(${
        params ? '\n' + params + ', \n            ' : ''
    }@RequestBody ${capEntity}CreateRequest request) {

    try {
        ${capEntity} created${capEntity} = ${camEntity}Service.create${capEntity}(${list +
        (list ? ', ' : '')}request);

        ${capEntity} response = dozerMapper.convert(created${capEntity}, ${capEntity}.class);

        URI location = linkTo(methodOn(${capEntity}Controller.class)
                .get${capEntity}(${list ? list + ', ' : ''}response.getId()))
                .toUri();

        return ResponseEntity
                .created(location)
                .body(response);
    } catch (ResourceNotFoundException e) {
        return ResponseEntity
                .badRequest()
                .body(ApiError.builder()
                        .errorMessage("No " + e.getResourceType().toString().toLowerCase()
                                + " found with ID " + e.getResourceId()).build());
    }
}\n\n`;

    //---------------------------------------
    // UPDATE AN ENTITY
    //---------------------------------------
    newCode += `  @PutMapping("${api}/{${camEntity}Id}")
public ResponseEntity<${capEntity}> update${capEntity}(${
        paramsFull ? '\n' + paramsFull + ', \n            ' : ''
    }@Valid @RequestBody ${capEntity}UpdateRequest request) {

    ${capEntity} updated${capEntity} = ${camEntity}Service.update${capEntity}(${listFull +
        (listFull ? ', ' : '')}request);

    return ResponseEntity.ok(updated${capEntity});
}\n\n`;

    //---------------------------------------
    // DELETE AN ENTITY
    //---------------------------------------
    newCode += `  @DeleteMapping("${api}/{${camEntity}Id}")
public ResponseEntity delete${capEntity}(
${paramsFull}) {

    ${camEntity}Service.delete${capEntity}(${listFull});
    return ResponseEntity.ok().build();
}`;

    newCode += `\n}`;
    setCode(newCode);
    }
});
return <CGenDisplay entity={entity} fileEnding="controller" code={code} />;
};
      
export default CGenController;      