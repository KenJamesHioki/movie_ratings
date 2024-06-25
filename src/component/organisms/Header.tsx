import React, { memo } from "react";
import { useUser } from "../../lib/UserProvider";
import { Link } from "react-router-dom";
import { useTheme } from "../../lib/ThemeProvider";
import { DarkMode, LightMode } from "@mui/icons-material";
import "../../styles/organisms/header.css";

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
        <Link to="/mypage" className={`header__user-icon-link ${currentUser.userId==="" && "header__user-icon-link_hide"}`}>
          <img src={currentUser.iconUrl} className="header__user-icon" alt="" />
        </Link>
      </div>
    </header>
  );
});
