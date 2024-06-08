import React, { useContext, useEffect, useState } from "react";
import { InvertedButton } from "../atoms/InvertedButton";
import { UserContext } from "../../lib/UserProvider";
import "../../styles/molecules/profileContainer.css";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

type Props = {
  numWatched: number | undefined;
  userId?: string;
};

type UserInfo = {
  displayName: string;
  introduction: string;
  iconUrl: string;
};

export const ProfileContainer: React.FC<Props> = ({ numWatched, userId = null }) => {
  const { currentUser, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const fetchProfile = async (id: string) => {
    try {
      const docSnap = await getDoc(doc(db, "users", id));

      setUserInfo({
        displayName: docSnap.data().displayName,
        introduction: docSnap.data().introduction,
        iconUrl: docSnap.data().iconUrl,
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    }
  }, [userId]);

  console.log(userId);

  return (
    <div className="profileContainer">
      <div className="profileContainer_icon">
        <img src={userId ? userInfo?.iconUrl : currentUser.iconUrl} alt="" />
      </div>
      <div className="profileContainer_other-info">
        <p className="profileContainer_display-name">
          {userId ? userInfo?.displayName : currentUser.displayName}
        </p>
        <p className="profileContainer_movies-watched">
          視聴映画数：{numWatched || 0}本
        </p>
        <p className="profileContainer_introduction">
          {userId ? userInfo?.introduction : currentUser.introduction}
        </p>
        {(userId === null || userId === currentUser.userId) && (
          <div className="profileContainer_button-container">
            <InvertedButton
              onClick={() => {
                navigate("/edit_profile");
              }}
            >
              プロフィールを編集
            </InvertedButton>
            <InvertedButton
              style={{ border: "1px red solid", color: "red" }}
              onClick={logout}
            >
              ログアウト
            </InvertedButton>
          </div>
        )}
      </div>
    </div>
  );
};
