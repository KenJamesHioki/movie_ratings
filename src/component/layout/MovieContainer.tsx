import React, { ReactNode } from "react";
import "../../styles/layout/movieContainer.css";

type Props = {
  children: ReactNode;
};

export const MovieContainer: React.FC<Props> = ({ children }) => {
  return <div className="movie-container">{children}</div>;
};
