import React, { memo } from "react";
import "../../styles/molecules/header.css";
import { useUser } from "../../lib/UserProvider";
import { Link } from "react-router-dom";
import { useTheme } from "../../lib/ThemeProvider";
import { DarkMode, LightMode } from "@mui/icons-material";

export const Header: React.FC = memo(() => {
  const { currentUser } = useUser();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <Link to="/">
        <img className="header_logo" src="/images/logo.png" />
      </Link>
      <div className="header_theme-and-icon">
        <div className="header_toggle-theme" onClick={toggleTheme}>
          {theme === "dark" ? (
            <>
              <LightMode />{" "}
            </>
          ) : (
            <>
              <DarkMode />
            </>
          )}
        </div>
        <Link to="/mypage" className={`header_icon ${currentUser.userId==="" && "hide"}`}>
          <img src={currentUser.iconUrl} alt="" />
        </Link>
      </div>
    </header>
  );
});
