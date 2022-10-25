import React from "./react";
import ReactDOM from "./react-dom";
const CounterContext = React.createContext();

function Child() {
  const { state, dispatch } = React.useContext(CounterContext);
  return (
    <div>
      <p>{state.number}</p>

      <button onClick={() => dispatch({ type: "ADD" })}>+</button>
      <button onClick={() => dispatch({ type: "MINUS" })}>-</button>
    </div>
  );
}

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

  return (
    <div>
      <CounterContext.Provider value={{ state, dispatch }}>
        <Child />
      </CounterContext.Provider>
    </div>
  );
}

const root = document.getElementById("root");
ReactDOM.render(<Counter />, root);
