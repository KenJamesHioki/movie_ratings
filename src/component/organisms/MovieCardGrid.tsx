import React, { ReactNode, memo } from "react";
import "../../styles/organisms/movieCardGrid.css";

type Props = {
  children: ReactNode;
};

export const MovieCardGrid: React.FC<Props> = memo(({ children }) => {
  return <div className="movieCardGrid">{children}</div>;
});
