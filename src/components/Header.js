import React from "react";
import "../styles/Header.css";
import { useAuth } from "../scripts/use-auth.js";
import { useHistory } from "react-router-dom";

export default function Header(props) {
  let history = useHistory();
  const auth = useAuth();

  const logout = () => {
    auth.signout(() => {
      history.push("/");
    });
  };
  return (
    <div className="header">
      <div onClick={props.menuClick} className="menu_button" ref={props.menuRef}>
        МЕНЮ
      </div>
      <div className="header_title">
        <h1>КЛАССНЫЙ ЖУРНАЛ</h1>
        <p>alpha</p>
      </div>
      <div className="exit_button" onClick={logout}>
        Выйти
      </div>
    </div>
  );
}
