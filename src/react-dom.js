import { REACT_TEXT } from "./constants";

function render(vdom, container) {
  mount(vdom, container);
}

function mount(vdom, container) {
  let newDOM = createDOM(vdom);
  container.appendChild(newDOM);
}

function createDOM(vdom) {
  if (typeof vdom === "string" || typeof vdom === "number") {
    return document.createTextNode(vdom);
  }
  let { type, props } = vdom;
  let dom;

  if (type === REACT_TEXT) {
    dom = document.createTextNode(props.content);
  } else if (typeof type === "function") {
    return mountFunctionComponent(vdom);
  } else {
    dom = document.createElement(type);
  }

  if (props) {
    updateProps(dom, {}, props);
    if (typeof props.children === "object" && props.children.type) {
      render(props.children, dom);
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    } else {
      render(props.children, dom);
    }
  }

  return dom;
}

function mountFunctionComponent(vdom) {
  const { type, props } = vdom;
  const renderVdom = type(props);
  return createDOM(renderVdom);
}

function reconcileChildren(childrenVdom, parentDOM) {
  for (let i = 0; i < childrenVdom.length; i++) {
    let childVdom = childrenVdom[i];
    render(childVdom, parentDOM);
  }
}

function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) {
    if (key === "children") {
      continue;
    }
    if (key === "style") {
      let styleObj = newProps[key];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (key.startsWith("on")) {
    } else {
      if (newProps[key]) {
        dom[key] = newProps[key];
      }
    }
  }
}

const ReactDOM = {
  render,
};

export default ReactDOM;
