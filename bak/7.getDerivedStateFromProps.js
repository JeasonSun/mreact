import React from "./react";
import ReactDOM from "./react-dom";

class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  componentDidMount() {
    console.log("[Child]", "componentDidMount");
  }


  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("[Child]", "getDerivedStateFromProps");
    return {
      count: nextProps.count * 2,
    };
  }

  componentDidUpdate() {
    console.log("[Child]", "componentDidUpdate");
  }

  componentWillUnmount() {
    console.log("[Child]", "componentWillUnmount");
  }

  render() {
    return <div>{this.state.count}</div>;
  }
}

class LifeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
    };
    console.log("[LifeComponent]", "initialize");
  }


  componentDidMount() {
    console.log("[LifeComponent]", "componentDidMount");
  }

  componentDidUpdate() {
    console.log("[LifeComponent]", "componentDidUpdate");
  }

  addHandler = () => {
    this.setState({ number: this.state.number + 1 });
  };

  render() {
    console.log("[LifeComponent]", "render");
    return (
      <div>
        <p>{this.state.number}</p>
        <div>
          <Child count={this.state.number} />
        </div>
        <button onClick={this.addHandler}> + </button>
      </div>
    );
  }
}

const root = document.getElementById("root");
ReactDOM.render(<LifeComponent />, root);
