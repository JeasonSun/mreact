import React from "./react";
import ReactDOM from "./react-dom";

class Counter extends React.Component {
  constructor() {
    super();
    this.state = {
      number: 1,
    };
  }

  onClickHandler = () => {
    console.log("onClickHandler");
    this.setState({ number: this.state.number + 1 });
  };

  render() {
    return (
      <div>
        <h1>{this.state.number}</h1>
        <button onClick={this.onClickHandler}>+</button>
      </div>
    );
  }
}

const root = document.getElementById("root");
ReactDOM.render(<Counter />, root);
