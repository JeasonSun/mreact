import { wrapToVdom } from "./utils";
import { Component } from "./component";

function createElement(type, config, children) {
  let ref;
  let key;
  if (config) {
    delete config.__source;
    delete config.__self;
    ref = config.ref;
    // delete config.ref;
    key = config.key;
    delete config.key;
  }
  let props = { ...config };
  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else {
    if (typeof children !== "undefined") {
      props.children = wrapToVdom(children);
    }
  }

  return {
    type,
    props,
    ref,
    key,
  };
}

function createRef() {
  return { current: null };
}

function forwardRef(functionComponent) {
  return class extends Component {
    render() {
      return functionComponent(this.props, this.props.ref);
    }
  };
}

const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
};

export default React;
