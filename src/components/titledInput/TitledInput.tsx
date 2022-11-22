import React, { ChangeEventHandler } from 'react';

const TitledInput = ({
  title, width, text, onChange
}: {
  title: string;
  text: string;
  width: string;
  onChange: any; //ChangeEventHandler<HTMLInputElement>;
}): JSX.Element => {
  return (
    <>
    <div>{title}</div>
      <input
        onChange={(event: any) => onChange(event.target.value)}
        value={text}
      ></input>
    </>
  );
};

export default TitledInput;