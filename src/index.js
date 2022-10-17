import React from "./react";
import  ReactDOM  from "./react-dom";

const element = React.createElement(
  "div",
  {
    style: {
      color: "red",
    },
    className: "title",
  },
  React.createElement("span", null, "Hello"),
  "World"
);
const root = document.getElementById("root");
ReactDOM.render(element, root);
