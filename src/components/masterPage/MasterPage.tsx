import React, { MouseEventHandler } from 'react';
import './masterPage.scss';

const MasterPage = ({
  title, leftBarContent, children
}: {
  title: JSX.Element;
  leftBarContent?: JSX.Element;
  children?: JSX.Element;
}): JSX.Element => {
  return (
    <div className="page-main">
      <div className="page_column">
        <div className="page_title">{title}</div>
        <div className="page_row">
          <div className="left-column">{leftBarContent}</div>
          <div className="right-column">{children}</div>
        </div>
      </div>
      </div>
  );
};

export default MasterPage;