import React from "./react";
import ReactDOM from "./react-dom";

function Counter() {

  const [number, setState] = React.useState(0);
  
  const handleClick = () => {
    setState(number + 1);
  };
  return (
    <div>
      <p>{number}</p>
      <button onClick={handleClick}>+</button>
    </div>
  );
}

const root = document.getElementById("root");
ReactDOM.render(<Counter />, root);
