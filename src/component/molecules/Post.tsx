import React, { memo, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";
import { Loader } from "../atoms/Loader";
import { showAlert } from "../../lib/showAlert";
import { useTheme } from "../../lib/ThemeProvider";
import "../../styles/molecules/post.css";

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
  const { theme } = useTheme();
  const [user, setUser] = useState<PostUserInfo>({
    displayName: "",
    introduction: "",
    iconUrl: "",
  });

  useEffect(() => {
    const updateUser = async () => {
      setIsLoading(true);
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
        showAlert({
          type: "error",
          message: "コメントの読み込みに失敗しました",
          theme,
        });
      } finally {
        setIsLoading(false);
      }
    };

    updateUser();
  }, [userId]);

  return (
    <div className="post">
      <Link className="post__user-info-container" to={`/mypage/${userId}`}>
        <div className="post__user-icon-container">
          <img className="post__user-icon" src={user.iconUrl} alt="" />
        </div>
        <div className="post__display-name">{user.displayName}</div>
      </Link>
      <Rating
        value={Number(score)}
        emptyIcon={
          <StarIcon
            style={{ opacity: 0.5, color: "gray" }}
            fontSize="inherit"
          />
        }
        readOnly
      />
      <p className="post__comment">{comment}</p>
      {isLoading && <Loader size={30} />}
    </div>
  );
});
