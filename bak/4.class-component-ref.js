import React from "./react";
import ReactDOM from "./react-dom";

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  focusInput = () => {
    this.inputRef.current.focus();
  };

  render() {
    return <input ref={this.inputRef} />;
  }
}
class Form extends React.Component {
  constructor(props) {
    super(props);
    this.textInputRef = React.createRef();
  }

  formFocus = () => {
    this.textInputRef.current.focusInput();
  };

  render() {
    return (
      <>
        <TextInput ref={this.textInputRef} />
        <button onClick={this.formFocus}>获取焦点</button>
      </>
    );
  }
}

const root = document.getElementById("root");
ReactDOM.render(<Form />, root);
