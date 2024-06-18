import React, { memo, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";
import "../../styles/organisms/post.css";
import { Loader } from "../atoms/Loader";
import { showAlert } from "../../lib/showAlert";
import { useTheme } from "../../lib/ThemeProvider";

type Props = {
  userId: string;
  score: number;
  comment: string;
};

type PostUserInfo = {
  displayName: string;
  introduction: string;
  iconUrl: string;
};

export const Post: React.FC<Props> = memo(({ userId, score, comment }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {theme} = useTheme();
  const [user, setUser] = useState<PostUserInfo>({
    displayName: "",
    introduction: "",
    iconUrl: "",
  });

  useEffect(() => {
    const updateUser = async () => {
      setIsLoading(true)
      try {
        const docSnap = await getDoc(doc(db, "users", userId));
        if (docSnap.exists()) {
          setUser({
            displayName: docSnap.data().displayName,
            introduction: docSnap.data().introduction,
            iconUrl: docSnap.data().iconUrl,
          });
        } else {
          console.error("指定のドキュメントが見つかりませんでした");
        }
      } catch (error) {
        console.error("ドキュメントの取得に失敗しました");
        showAlert({type:"error", message:"コメントの読み込みに失敗しました", theme})
      } finally {
        setIsLoading(false)
      }
    };

    updateUser();
  }, [userId]);

  return (
    <div className="post">
      <div className="post_icon-and-display-name">
        <Link to={`/mypage/${userId}`}>
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
      {isLoading && <Loader size={30}/>}
    </div>
  );
});
