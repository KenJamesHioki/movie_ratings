import React, { memo, useContext } from "react";
import "../../styles/molecules/header.css";
import { UserContext } from "../../lib/UserProvider";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../lib/ThemeProvider";
import { DarkMode, LightMode } from "@mui/icons-material";

export const Header: React.FC = memo(() => {
  const { currentUser } = useContext(UserContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

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
        <Link to="/profile" className="header_icon">
            <img src={currentUser.iconUrl} alt="" />
        </Link>
      </div>
    </header>
  );
});
