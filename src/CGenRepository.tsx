import React, { useEffect, useState } from 'react';
import { CGenColumn } from './CGenTypes';
import c from './CGenUtil';
import Button from './components/button/Button';
import CGenDisplay from './CGenDisplay';

const CGenRepository = ({
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
      newCode = `package ${c.super_root()}${pkg}.repository;
import ${c.super_root()}${pkg}.entity.${capEntity}Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ${capEntity}Repository extends JpaRepository<${capEntity}Entity, String> {

}`;
    }
    setCode(newCode);
  });
  return (
    <CGenDisplay
      entity={entity}
      fileEnding="repository"
      code={code}
      short={true}
    />
  );
};

export default CGenRepository;