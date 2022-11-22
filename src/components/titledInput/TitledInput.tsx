import React, { ChangeEventHandler } from 'react';
import './titledInput.scss';

const TitledInput = ({
  title, width, text, rows, onChange
}: {
  title: string;
  text: string;
  width: string;
  rows?: number;
  onChange: any; //ChangeEventHandler<HTMLInputElement>;
}): JSX.Element => {
  return (
    <>
    <div>{title}</div>
      {rows > 1 ? 
        <textarea className="text-area" style={{height: rows.toString()+'rem'}}
        onChange={(event: any) => onChange(event.target.value)}
        value={text}></textarea>
      :
        <input className="text-input"
          onChange={(event: any) => onChange(event.target.value)}
          value={text}
        ></input>
      }
    </>
  );
};

export default TitledInput;