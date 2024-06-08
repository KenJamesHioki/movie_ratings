import React, { memo, useEffect, useState } from "react";
import "../../styles/molecules/post.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";

type Props = {
  userId: string;
  score: number;
  comment: string;
};

type User = {
  displayName: string;
  introduction: string;
  iconUrl: string;
};

export const Post: React.FC<Props> = memo(({ userId, score, comment }) => {
  const [user, setUser] = useState<User>({
    displayName: "",
    introduction: "",
    iconUrl: "",
  });

  useEffect(() => {
    const updateUser = async () => {
      const docSnap = await getDoc(doc(db, "users", userId));
      setUser(docSnap.data());
    };
    updateUser();
  }, [userId]);

  return (
    <div className="post">
      <div className="post_icon-and-display-name">
        <Link to={`/profile/${userId}`}>
          <div className="post_icon">
            <img src={user.iconUrl} alt="" />
          </div>
        </Link>
        <div className="post_display-name">{user.displayName}</div>
      </div>
      <Rating
        className="post_score"
        value={Number(score)}
        emptyIcon={
          <StarIcon
            style={{ opacity: 0.5, color: "gray" }}
            fontSize="inherit"
          />
        }
        readOnly
      />
      <p className="post_comment">{comment}</p>
    </div>
  );
});
