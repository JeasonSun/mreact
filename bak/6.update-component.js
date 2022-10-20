import React from "./react";
import ReactDOM from "./react-dom";

class Child extends React.Component {
  componentWillMount() {
    console.log("[Child]", "componentWillMount");
  }

  componentDidMount() {
    console.log("[Child]", "componentDidMount");
  }

  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = !!(nextProps.count % 3 === 0);
    console.log("[Child]", "shouldComponentUpdate", shouldUpdate);
    return shouldUpdate;
  }

  componentWillReceiveProps(){
    console.log('[Child]', 'componentWillReceiveProps')
  }

  componentWillUpdate() {
    console.log("[Child]", "componentWillUpdate");
  }

  componentDidUpdate() {
    console.log("[Child]", "componentDidUpdate");
  }

  componentWillUnmount() {
    console.log("[Child]", "componentWillUnmount");
  }

  render() {
    return <div>{this.props.count}</div>;
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
        <div>
          {this.state.number === 4 ? null : <Child count={this.state.number} />}
        </div>
        <button onClick={this.addHandler}> + </button>
      </div>
    );
  }
}

const root = document.getElementById("root");
ReactDOM.render(<LifeComponent />, root);
