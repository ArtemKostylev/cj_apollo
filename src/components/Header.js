import React from "react";
import "../styles/Header.css";

export default class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <div onClick={this.props.menuClick} className="menuButton">
          МЕНЮ
        </div>
      </div>
    );
  }
}
