import React from "react";
import "../styles/App.css";
import Menu from "./Menu";
import Header from "./Header";
import Table from "./Table";
import Other from "./Other";
import { Switch, Route, Redirect } from "react-router-dom";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: false,
    };
    this.menuClick.bind(this);
  }

  menuClick = () => {
    this.setState((prevState) => ({
      menuVisible: !prevState.menuVisible,
    }));
  };

  render() {
    return (
      <div className="App">
        <Menu visible={this.state.menuVisible} close={this.menuClick}></Menu>
        <div
          className={`Cover ${this.state.menuVisible ? "menuVisible" : ""}`}
        />
        <div
          className={`Content ${this.state.menuVisible ? "menuVisible" : ""}`}
        >
          <Header menuClick={this.menuClick}></Header>
          <Switch>
            <Route path="/jounal" component={Table} />
            <Route path="/other" component={Other} />
            <Redirect from="/" to="/jounal" />
          </Switch>
        </div>
      </div>
    );
  }
}
