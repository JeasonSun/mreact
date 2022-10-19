import React from "./react";
import ReactDOM from "./react-dom";

class LifeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
    };
    console.log("[LifeComponent]", "initialize");
  }
  componentWillMount() {
    console.log("[LifeComponent]", "componentWillMount");
  }

  componentDidMount() {
    console.log("[LifeComponent]", "componentDidMount");
  }

  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = !!(nextState.number % 2 === 0);
    console.log("[LifeComponent]", "shouldComponentUpdate", shouldUpdate);
    return shouldUpdate;
  }

  componentWillUpdate() {
    console.log("[LifeComponent]", "componentWillUpdate");
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
        <button onClick={this.addHandler}> + </button>
      </div>
    );
  }
}

const root = document.getElementById("root");
ReactDOM.render(<LifeComponent />, root);
