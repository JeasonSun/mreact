import { shallowEqual, wrapToVdom } from "./utils";
import { Component, PureComponent } from "./component";
import {
  useState,
  useCallback,
  useMemo,
  useReducer,
  useContext,
  useEffect,
} from "./react-dom";

import {
  REACT_FORWARD_REF_TYPE,
  REACT_CONTEXT,
  REACT_PROVIDE,
  REACT_MEMO,
} from "./constants";

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

// function createContext() {
//   function Provider({ value, children }) {
//     Provider._value = value;
//     return children;
//   }
//   function Consumer({ children }) {
//     return children(Provider._value);
//   }
//   return { Provider, Consumer };
// }

function createContext() {
  const context = {
    $$typeof: REACT_CONTEXT,
  };
  context.Provider = {
    $$typeof: REACT_PROVIDE,
    _context: context,
  };

  context.Consumer = {
    $$typeof: REACT_CONTEXT,
    _context: context,
  };
  return context;
}

function memo(type, compare = shallowEqual) {
  return {
    $$typeof: REACT_MEMO,
    type,
    compare,
  };
}

const React = {
  createElement,
  Component,
  PureComponent,
  createRef,
  forwardRef,
  createContext,
  memo,
  useState,
  useCallback,
  useMemo,
  useReducer,
  useContext,
  useEffect,
};

export default React;
