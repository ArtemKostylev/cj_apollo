import React from "react";
import "../styles/Menu.css";
import { Link } from "react-router-dom";
import { useAuth } from "../scripts/use-auth";
import { adminItems, userItems, subRoute } from "../scripts/constants";

export default function Menu(props) {
  const auth = useAuth();

  var itemNames = auth.user.roleId === 1 ? adminItems : userItems;

  if (
    auth.user.courses.find((course) => course.group) &&
    itemNames.length < 5
  ) {
    itemNames.push(subRoute);
  }

  return (
    <div className={`main ${props.visible ? "opened" : ""} noselect`}>
      <div className="item_container top">
        <div className="item_text top">МЕНЮ</div>
        <div className="close_button" onClick={props.close}>
          Закрыть
        </div>
      </div>
      {itemNames.map((item) => MenuItem({ ...item, close: props.close }))}
    </div>
  );
}

const MenuItem = (props) => {
  return (
    <div className="item_container" key={props.name}>
      <Link
        to={props.path}
        style={{ textDecoration: "none", color: "inherit" }}
        onClick={props.close}
      >
        <p className="item_text">{props.title}</p>
      </Link>
    </div>
  );
};
