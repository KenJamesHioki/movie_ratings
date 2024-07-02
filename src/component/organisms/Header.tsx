import React, { memo } from "react";
import { useUser } from "../../lib/UserProvider";
import { Link } from "react-router-dom";
import { useTheme } from "../../lib/ThemeProvider";
import { DarkMode, LightMode } from "@mui/icons-material";
import "../../styles/organisms/header.css";
import { UserIcon } from "../atoms/UserIcon";

export const Header: React.FC = memo(() => {
  const { currentUser } = useUser();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <Link className="header__logo-link" to="/">
        <img className="header__logo" src="/images/logo.png" />
      </Link>
      <div className="header__icon-container">
        <div className="header__toggle-theme" onClick={toggleTheme}>
          {theme === "dark" ? (
            <>
              <LightMode className="header__theme-icon" />{" "}
            </>
          ) : (
            <>
              <DarkMode className="header__theme-icon" />
            </>
          )}
        </div>
        <UserIcon navigateTo="/mypage" size="sm" src={currentUser.iconUrl} isPointer={true} isHide={!currentUser.userId ? true : false}/>
      </div>
    </header>
  );
});
