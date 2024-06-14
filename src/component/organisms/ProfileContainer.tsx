import React from "react";
import { InvertedButton } from "../atoms/button/InvertedButton";
import { useUser } from "../../lib/UserProvider";
import { useNavigate } from "react-router-dom";
import "../../styles/organisms/profileContainer.css";

type ProfileInfo = {
  userId: string;
  displayName: string;
  introduction: string;
  iconUrl: string;
};

type Props = {
  numWatched: number | undefined;
  profileInfo: ProfileInfo;
};

export const ProfileContainer: React.FC<Props> = ({
  numWatched,
  profileInfo,
}) => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

  return (
    <div className="profileContainer">
      <div className="profileContainer_icon">
        <img src={profileInfo.iconUrl} alt="" />
      </div>
      <div className="profileContainer_other-info">
        <p className="profileContainer_display-name">
          {profileInfo.displayName}
        </p>
        <p className="profileContainer_movies-watched">
          視聴映画数：{numWatched || 0}本
        </p>
        <p className="profileContainer_introduction">
          {profileInfo.introduction}
        </p>
        {(profileInfo.userId === null ||
          profileInfo.userId === currentUser.userId) && (
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
