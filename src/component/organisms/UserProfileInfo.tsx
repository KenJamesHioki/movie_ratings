import React, { memo } from "react";
import { InvertedButton } from "../atoms/button/InvertedButton";
import { useUser } from "../../lib/UserProvider";
import { useNavigate } from "react-router-dom";
import "../../styles/organisms/userProfileInfo.css";
import { UserIcon } from "../atoms/UserIcon";

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

export const UserProfileInfo: React.FC<Props> = memo(
  ({ numWatched, profileInfo }) => {
    const { currentUser, logout } = useUser();
    const navigate = useNavigate();

    return (
      <div className="userProfileInfo">
        <UserIcon navigateTo="" size="lg" src={profileInfo.iconUrl} isPointer={false} isHide={!currentUser.userId ? true : false}/>
        <div className="userProfileInfo__info-container">
          <p className="userProfileInfo__display-name">
            {profileInfo.displayName}
          </p>
          <p className="userProfileInfo__movies-watched">
            視聴映画数：{numWatched || 0}本
          </p>
          <p className="userProfileInfo__introduction">
            {profileInfo.introduction}
          </p>
          {(profileInfo.userId === null ||
            profileInfo.userId === currentUser.userId) && (
            <div className="userProfileInfo__button-container">
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
  }
);
