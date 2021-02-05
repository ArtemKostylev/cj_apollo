//TODO implement menu component
import React from "react";
import "../styles/Menu.css";

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
        {this.state.itemNames.map((i) => MenuItem({ i: i }))}
      </div>
    );
  }
}

const MenuItem = (props) => {
  return (
    <div className="item_container" key={props.key}>
      <p className="item_text">{props.i}</p>
    </div>
  );
};

const itemNamesFull = [
  "Раздел 1",
  "Раздел 2",
  "Раздел 3",
  "Раздел 4",
  "Раздел 5",
  "Раздел 6",
];
