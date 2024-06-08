import React, { ReactNode } from "react";
import "../../styles/layout/postContainer.css"

type Props = {
  children: ReactNode;
};

export const PostContainer: React.FC<Props> = ({ children }) => {
  return <div className="post-container">{children}</div>;
};
