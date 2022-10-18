import React from "./react";
import ReactDOM from "./react-dom";

Object.freeze = null;

class Counter extends React.Component {
  constructor() {
    super();
    this.state = {
      number: 0,
    };
  }

  onClickHandler = () => {
    console.log("onClickHandler");

    this.setState({ number: this.state.number + 1 });
    console.log("clickHandler 1", this.state.number);
    this.setState({ number: this.state.number + 1 });
    console.log("clickHandler 2", this.state.number);
    setTimeout(() => {
      this.setState({ number: this.state.number + 1 });
      console.log("setTimeout 1", this.state.number);
      this.setState({ number: this.state.number + 1 });
      console.log("setTimeout 2", this.state.number);
    });
  };

  render() {
    // 使用react 18 的时候，编译生成的instance 和 vdom都是不可扩展的。Object.freeze 限制了扩展。
    return (
      <div>
        <h1> {this.state.number}</h1>
        <button onClick={this.onClickHandler}>+</button>
      </div>
    );
    // return React.createElement(
    //   "div",
    //   {},
    //   React.createElement("h1", {}, this.state.number),
    //   React.createElement("button", { onClick: this.onClickHandler }, "+")
    // );
  }
}

const root = document.getElementById("root");
ReactDOM.render(React.createElement(Counter), root);
