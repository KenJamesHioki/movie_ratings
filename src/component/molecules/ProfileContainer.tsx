import React from "react";
import { InvertedButton } from "../atoms/InvertedButton";
import { useUser } from "../../lib/UserProvider";
import "../../styles/molecules/profileContainer.css";
import { useNavigate } from "react-router-dom";

type UserInfo = {
  userId: string;
  displayName: string;
  introduction: string;
  iconUrl: string;
};

type Props = {
  numWatched: number | undefined;
  userInfo: UserInfo;
};

export const ProfileContainer: React.FC<Props> = ({ numWatched, userInfo }) => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

  return (
    <div className="profileContainer">
      <div className="profileContainer_icon">
        <img src={userInfo.iconUrl} alt="" />
      </div>
      <div className="profileContainer_other-info">
        <p className="profileContainer_display-name">{userInfo.displayName}</p>
        <p className="profileContainer_movies-watched">
          視聴映画数：{numWatched || 0}本
        </p>
        <p className="profileContainer_introduction">{userInfo.introduction}</p>
        {(userInfo.userId === null ||
          userInfo.userId === currentUser.userId) && (
          <div className="profileContainer_button-container">
            <InvertedButton
              type="button"
              onClick={() => {
                navigate("/edit_profile");
              }}
            >
              プロフィールを編集
            </InvertedButton>
            <InvertedButton
              type="button"
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
