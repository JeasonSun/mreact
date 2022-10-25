import React from "./react";
import ReactDOM from "./react-dom";

function Child({ data, clickHandler }) {
  console.log("render Child");
  return (
    <div>
      <hr />
      <p>{data.number}</p>
      <button onClick={clickHandler}>+</button>
    </div>
  );
}

const MemoChild = React.memo(Child);

function Counter() {
  const [number, setNumber] = React.useState(0);
  const [name, setName] = React.useState("mojie");
  const data = React.useMemo(
    () => ({
      number,
    }),
    [number]
  );
  const setNumberHandler = React.useCallback(() => {
    setNumber(number + 1);
  }, [number]);

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <MemoChild data={data} clickHandler={setNumberHandler} />
    </div>
  );
}

const root = document.getElementById("root");
ReactDOM.render(<Counter />, root);
