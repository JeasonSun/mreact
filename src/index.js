import React from "./react";
import ReactDOM from "./react-dom";

function Child(props, ref) {
  // 父级中可以通过ref操作的权限太大，比如可以删除元素，修改数据
  // 所以，我们通过 useImperativeHandle 来规定和限制工作
  const inputRef = React.useRef();

  React.useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      print() {
        console.log("print");
      },
    };
  });

  return (
    <div>
      <input ref={inputRef} />
    </div>
  );
}

const ForwardRefChild = React.forwardRef(Child);

function Parent() {
  const childRef = React.useRef();

  const focusHandler = () => {
    if (childRef.current) {
      childRef.current.focus();
    }
  };

  const removeHandler = () => {
    if (childRef.current) {
      childRef.current.remove();
    }
  };

  return (
    <div>
      <ForwardRefChild ref={childRef} />
      <button onClick={focusHandler}>获取焦点</button>
      <button onClick={removeHandler}>删除元素</button>
    </div>
  );
}

const root = document.getElementById("root");
ReactDOM.render(<Parent />, root);
