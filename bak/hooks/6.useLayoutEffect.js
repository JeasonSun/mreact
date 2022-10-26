import React from "./react";
import ReactDOM from "./react-dom";

function Parent() {
  let style = {
    backgroundColor: "red",
    width: "100px",
    height: "100px",
    margin: "10px",
  };
  const effectRef = React.useRef();
  const effectLayoutRef = React.useRef();

  React.useEffect(() => {
    if (effectRef.current) {
      effectRef.current.style.transform = "translateX(500px)";
      effectRef.current.style.transition = "all 0.5s";
    }
  }, []);

  React.useLayoutEffect(() => {
    if (effectLayoutRef.current) {
      effectLayoutRef.current.style.transform = "translateX(500px)";
      effectLayoutRef.current.style.transition = "all 0.5s";
    }
  });

  return (
    <div>
      <div style={style} ref={effectRef}>
        {" "}
        useEffect{" "}
      </div>
      <div style={style} ref={effectLayoutRef}>
        {" "}
        useLayoutEffect
      </div>
    </div>
  );
}

const root = document.getElementById("root");
ReactDOM.render(<Parent />, root);
