import React from "./react";
import ReactDOM from "./react-dom";

class RefDemo extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef1 = React.createRef();
    this.inputRef2 = React.createRef();
    this.result = React.createRef();
  }

  sumHandler = () => {
    const sum = (+this.inputRef1.current.value) + (+this.inputRef2.current.value);
    this.result.current.value = sum;
  };

  render() {
    return (
      <>
        <input ref={this.inputRef1} />
        <span> + </span>
        <input ref={this.inputRef2} />
        <button onClick={this.sumHandler}> 确认 </button>
        <>
          <input ref={this.result} />
        </>
      </>
    );
  }
}

const root = document.getElementById("root");
ReactDOM.render(<RefDemo />, root);
