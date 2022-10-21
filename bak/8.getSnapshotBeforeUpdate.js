import React from "./react";
import ReactDOM from "./react-dom";

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: [],
    };
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState((state) => {
        return {
          message: [state.message.length, ...state.message],
        };
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  getSnapshotBeforeUpdate() {
    return {
      prevScrollTop: this.containerRef.current.scrollTop,
      prevScrollHeight: this.containerRef.current.scrollHeight,
    };
  }

  componentDidUpdate(
    prevProps,
    prevState,
    { prevScrollTop, prevScrollHeight }
  ) {
    if (this.containerRef.current) {
      this.containerRef.current.scrollTop =
        prevScrollTop +
        this.containerRef.current.scrollHeight -
        prevScrollHeight;
    }
  }

  render() {
    return (
      <div className="message-wrap" ref={this.containerRef}>
        {this.state.message.map((item) => (
          <p>{item}</p>
        ))}
      </div>
    );
  }
}

const root = document.getElementById("root");
ReactDOM.render(<Message />, root);
