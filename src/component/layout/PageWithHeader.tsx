import React, { ReactNode } from "react";
import { Header } from "../molecules/Header";
import "../../styles/layout/pageWithHeader.css";

type Props = {
  children: ReactNode;
};

export const PageWithHeader: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <div className="content">{children}</div>
    </>
  );
};
