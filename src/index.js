import React from "./react";
import ReactDOM from "./react-dom";

class Result extends React.PureComponent {
  render() {
    console.log("render Result");
    return <p>{this.props.count}</p>;
  }
}
class Counter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
    };
    this.inputRef = React.createRef();
  }
  onClickHandler = () => {
    this.setState({
      number: this.state.number + Number(this.inputRef.current.value),
    });
  };

  render() {
    console.log("render Counter");
    return (
      <div>
        count: {this.state.number}
        <p>
          增加： <input ref={this.inputRef} />
        </p>
        <button onclick={this.onClickHandler}>+</button>
        <Result count={this.state.number} />
      </div>
    );
  }
}

const root = document.getElementById("root");
ReactDOM.render(<Counter />, root);
