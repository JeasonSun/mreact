import React from "./react";
import ReactDOM from "./react-dom";

function TextInput(props, ref) {
  return <input ref={ref} />;
}

const ForwardedInput = React.forwardRef(TextInput);

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.textInputRef = React.createRef();
  }

  formFocus = () => {
    this.textInputRef.current.focus();
  };

  render() {
    return (
      <>
        <ForwardedInput ref={this.textInputRef} />
        <button onClick={this.formFocus}>获取焦点</button>
      </>
    );
  }
}

const root = document.getElementById("root");
ReactDOM.render(<Form />, root);
