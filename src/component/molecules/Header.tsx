import React, { memo, useContext } from "react";
import "../../styles/molecules/header.css";
import { UserContext } from "../../lib/UserProvider";
import { Link } from "react-router-dom";

export const Header: React.FC = memo(() => {
  const { currentUser } = useContext(UserContext);

  return (
    <header className="header">
      <Link to="/">
        <img className="header_logo" src="/images/logo.png" />
      </Link>
      <Link to="/profile">
        <div className="header_icon">
          <img src={currentUser.iconUrl} alt="" />
        </div>
      </Link>
    </header>
  );
});
