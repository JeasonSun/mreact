import React from "./react";
import ReactDOM from "./react-dom";

const ThemeContext = React.createContext();
const { Provider, Consumer } = ThemeContext;

class Content extends React.Component {
  static contextType = ThemeContext;

  render() {
    return (
      <div
        style={{
          border: `3px solid ${this.context.color}`,
          padding: "10px",
        }}
      >
        内容
        <div>
          <button
            onClick={() => {
              this.context.changeColor("red");
            }}
          >
            变红
          </button>
          <button
            onClick={() => {
              this.context.changeColor("green");
            }}
          >
            变绿
          </button>
        </div>
      </div>
    );
  }
}

class Main extends React.Component {
  static contextType = ThemeContext;

  render() {
    return (
      <div
        style={{
          border: `3px solid ${this.context.color}`,
          padding: "10px",
        }}
      >
        主体
        <Content />
      </div>
    );
  }
}

function Title() {
  return (
    <Consumer>
      {(value) => (
        <div style={{ border: `3px solid ${value.color}`, padding: "10px" }}>
          标题
        </div>
      )}
    </Consumer>
  );
}
// class Title extends React.Component {
//   static contextType = ThemeContext;

//   render() {
//     return (
//       <div
//         style={{
//           border: `3px solid ${this.context.color}`,
//           padding: "10px",
//         }}
//       >
//         标题
//       </div>
//     );
//   }
// }

class Header extends React.Component {
  static contextType = ThemeContext;

  render() {
    return (
      <div
        style={{
          border: `3px solid ${this.context.color}`,
          padding: "10px",
        }}
      >
        头部
        <Title />
      </div>
    );
  }
}
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "red",
    };
  }

  changeColor = (color) => {
    this.setState({
      color,
    });
  };

  render() {
    const value = { color: this.state.color, changeColor: this.changeColor };
    return (
      <Provider value={value}>
        <div
          style={{
            border: `3px solid ${this.state.color}`,
            padding: "10px",
            width: "400px",
          }}
        >
          主页
          <Header />
          <Main />
        </div>
      </Provider>
    );
  }
}
const root = document.getElementById("root");
ReactDOM.render(<Page />, root);
