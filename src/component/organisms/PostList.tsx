import React, { ReactNode, memo } from "react";
import "../../styles/organisms/postList.css";

type Props = {
  children: ReactNode;
};

export const PostList: React.FC<Props> = memo(({ children }) => {
  return <div className="postList">{children}</div>;
});
