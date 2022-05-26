import React from "react";

interface Props {
    ItemsClassName: string;
    ItemClassName: string;
    children?: React.ReactNode;
}


const AllTabs: React.FC<Props> = ({
    children,
    ItemsClassName,
    ItemClassName,
  }) => {
  return (
    <>
      <ul className={ItemsClassName}>
        <li className={ItemClassName}>
        {children}
        </li>
      </ul>
    </>
  );
};

export default AllTabs;
