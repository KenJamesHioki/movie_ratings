import React, { memo, useEffect, useState } from "react";
import "../../styles/molecules/post.css";
import { collection, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";

type Props = {
  userId: string;
  score: number;
  comment: string;
}

type User = {
  displayName: string;
  introduction: string;
  iconUrl: string;
}

export const Post: React.FC<Props> = memo(({userId, score, comment}) => {
  const [user, setUser] = useState<User>({
    displayName: "",
    introduction: "",
    iconUrl: "",
  });
  useEffect(()=> {
    const updateUser = async () => {
      const docSnap = await getDoc(doc(db,"users",userId));      
      setUser(docSnap.data());
    }
    updateUser();
  },[userId])

  return (
    <div className="post">
      <div className="post_icon-and-display-name">
        <div className="post_icon">
          <img src={user.iconUrl} alt="" />
        </div>
        <div className="post_display-name">{user.displayName}</div>
      </div>
      <div className="post_score">★ {score}</div>
      <p className="post_comment">
        {comment}
      </p>
    </div>
  );
});
