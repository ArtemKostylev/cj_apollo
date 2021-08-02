import React from "react";
import "../styles/Header.css";
import { useAuth } from "../scripts/use-auth.js";
import { useHistory, useLocation } from "react-router-dom";
import { getHeaderFromRoute } from "../scripts/utils";

export default function Header(props) {
  let history = useHistory();
  const auth = useAuth();
  const location = useLocation();

  /*TODO add header text change on route changes.
  (useLocation).maybe, it is reasonable to move
  all items from menu to constants, and than export them here.
  */

  const logout = () => {
    auth.signout(() => {
      history.push("/");
    });
  };
  return (
    <div className="header noselect">
      <div
        onClick={props.menuClick}
        className="menu_button"
        ref={props.menuRef}
      >
        МЕНЮ
      </div>
      <div className="header_title">
        <h1>{getHeaderFromRoute(location.pathname)}</h1>
      </div>
      <div className="exit_button" onClick={logout}>
        Выйти
      </div>
    </div>
  );
}
