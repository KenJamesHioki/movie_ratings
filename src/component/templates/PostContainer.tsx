import React, { ReactNode, memo } from "react";
import "../../styles/templates/postContainer.css"

type Props = {
  children: ReactNode;
};

export const PostContainer: React.FC<Props> = memo(({ children }) => {
  return <div className="post-container">{children}</div>;
});
