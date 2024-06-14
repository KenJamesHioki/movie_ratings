import React, { ReactNode, memo } from "react";
import "../../styles/templates/movieContainer.css";

type Props = {
  children: ReactNode;
};

export const MovieContainer: React.FC<Props> = memo(({ children }) => {
  return <div className="movie-container">{children}</div>;
});
