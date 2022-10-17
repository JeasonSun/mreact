import React from "./react";
import ReactDOM from "./react-dom";

// const element = React.createElement(
//   "div",
//   {
//     style: {
//       color: "red",
//     },
//     className: "title",
//   },
//   React.createElement("span", null, "Hello"),
//   "World"
// );

// function FunctionComponent(props) {
//   const element = React.createElement(
//     "div",
//     {
//       style: {
//         color: "red",
//       },
//       className: "title",
//     },
//     React.createElement("span", null, "Hello"),
//     props.name
//   );
//   return element;
// }

function FunctionComponent(props) {
  return (
    <h1>
      Hello, <span>{props.name}</span>
    </h1>
  );
}

const App = React.createElement(FunctionComponent, { name: "mojie" });

console.log(App);

const root = document.getElementById("root");
ReactDOM.render(App, root);
