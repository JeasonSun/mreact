import React from "./react";
import ReactDOM from "./react-dom";

function Counter() {
  const reducer = (state, action) => {
    switch (action.type) {
      case "ADD":
        return { number: state.number + 1 };
      case "MINUS":
        return { number: state.number - 1 };
      default:
        return state;
    }
  };

  const [state, dispatch] = React.useReducer(reducer, { number: 0 });

  const [name, setName ]= React.useState('mojie');

  return (
    <div>
      <p>{state.number}</p>
      <button onClick={() => dispatch({ type: "ADD" })}>+</button>
      <button onClick={() => dispatch({ type: "MINUS" })}>-</button>
      <div>
        <p>{name}</p>
        <button onClick = {() => { setName('jeason')}}> change name</button>
      </div>
    </div>
  );
}

const root = document.getElementById("root");
ReactDOM.render(<Counter />, root);
