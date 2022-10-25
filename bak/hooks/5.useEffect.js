import React from "./react";
import ReactDOM from "./react-dom";

function Counter() {
  const [number, setNumber] = React.useState(0);
  React.useEffect(() => {
    console.log("创建定时器");
    const timer = setInterval(() => {
      // console.log("执行定时器", number);
      setNumber(number + 1);
    }, 1000);
    return () => {
      console.log("销毁定时器");
      clearInterval(timer);
    };
  }, [number]);

  return <div>{number}</div>;
}

const root = document.getElementById("root");
ReactDOM.render(<Counter />, root);
