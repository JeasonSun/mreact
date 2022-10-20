import { wrapToVdom } from "./utils";
import { Component } from "./component";
import { REACT_FORWARD_REF_TYPE } from "./constants";

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

function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render,
  };
}

const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
};

export default React;
