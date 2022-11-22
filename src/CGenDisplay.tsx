import React from 'react';
import c from './CGenUtil';
import Button from './components/button/Button';

const CGenDisplay = ({
  entity,
  fileEnding,
  code,
  short = false,
}: {
  entity: string;
  fileEnding: string;
  code: string;
  short?: boolean;
}): JSX.Element => {
  return (
    <>
      {/* <h1>{table.toUpperCase()} ENTITY CLASS</h1> */}
      <Button
        text={`${entity.toUpperCase()} ${c
          .capitalCase(fileEnding)
          .toUpperCase()} CLASS`}
        onClick={() => {
          c.saveFile(
            `${c.capitalCase(entity)}${c.capitalCase(fileEnding)}.java`,
            code,
          );
        }}
        style={{ width: '500px', margin: '0px 0 8px 0' }}
      />
      <textarea
        value={code}
        spellCheck={false}
        className={short ? 'short' : ''}
      />
    </>
  );
};

export default CGenDisplay;