import React, { MouseEventHandler } from 'react';

const Button = ({
    text, onClick, style
}: {
    text: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    style?: any;
}): JSX.Element => {
  return (
    <>
      <button style={style} onClick={onClick}>{text}</button>
    </>
  );
};

export default Button;