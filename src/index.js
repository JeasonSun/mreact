import React from "./react";
import ReactDOM from "./react-dom";

const ThemeContext = React.createContext();

const { Provider, Consumer } = ThemeContext;

class Main extends React.Component {
  static contextType = ThemeContext;

  render() {
    return <div>Main: context.name: {this.context.name} </div>;
  }
}

function Footer() {
  return (
    <Consumer>
      {(context) => {
        return <div>Footer: context.name: {context.name}</div>;
      }}
    </Consumer>
  );
}
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Jeason",
    };
  }

  clickHandler = () => {
    this.setState({ name: "mojie" });
  };

  render() {
    const value = { name: this.state.name };
    return (
      <Provider value={value}>
        <div
          style={{
            border: `3px solid red`,
            padding: "10px",
            width: "400px",
          }}
        >
          主页
          <Main />
          <Footer />
          <button onClick={this.clickHandler}>Change Name</button>
        </div>
      </Provider>
    );
  }
}
const root = document.getElementById("root");
ReactDOM.render(<Page />, root);
