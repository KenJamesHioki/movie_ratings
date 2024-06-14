import React from "react";
import { PageWithHeader } from "../templates/PageWithHeader";
import { PrimaryButton } from "../atoms/button/PrimaryButton";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/page404.css";

export const Page404: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageWithHeader>
      <div className="page404_wrapper">
        <div className="page404_code">404</div>
        <div className="page404_message">お探しのページが見つかりません</div>
        <PrimaryButton type="button" onClick={() => navigate("/")}>
          ホームに遷移する
        </PrimaryButton>
      </div>
    </PageWithHeader>
  );
};
