//TODO implement menu component
import React from "react";
import "../styles/Menu.css";
import { Link } from "react-router-dom";

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemNames: itemNamesFull,
    };
  }

  render() {
    return (
      <div className={`main ${this.props.visible ? "opened" : ""}`}>
        <div className="item_container top">
          <div className="item_text top">МЕНЮ</div>
          <div className="close_button" onClick={this.props.close}>
            Закрыть
          </div>
        </div>
        {this.state.itemNames.map((item) =>
          MenuItem({ ...item, close: this.props.close })
        )}
      </div>
    );
  }
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

const itemNamesFull = [
  {
    name: "Journal",
    path: "/journal",
    title: "Классный журнал",
  },
  {
    name: "Compensation",
    path: "/compensation",
    title: "Возмещение",
  },
];
