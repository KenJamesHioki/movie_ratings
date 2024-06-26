import React, { memo } from "react";
import { PageWithHeader } from "../templates/PageWithHeader";
import { PrimaryButton } from "../atoms/button/PrimaryButton";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/page404.css";

export const Page404: React.FC = memo(() => {
  const navigate = useNavigate();

  return (
    <PageWithHeader>
      <div className="page404__wrapper">
        <div className="page404__code">404</div>
        <div className="page404__message">お探しのページが見つかりません</div>
        <PrimaryButton type="button" onClick={() => navigate("/")}>
          ホームに遷移する
        </PrimaryButton>
      </div>
    </PageWithHeader>
  );
});
