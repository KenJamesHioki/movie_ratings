import React, { ReactNode, memo } from "react";
import { Header } from "../organisms/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/templates/pageWithHeader.css";

type Props = {
  children: ReactNode;
};

export const PageWithHeader: React.FC<Props> = memo(({ children }) => {
  return (
    <>
      <Header />
      <div className="content">{children}</div>
      <ToastContainer />
    </>
  );
});
