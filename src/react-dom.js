import { REACT_TEXT } from "./constants";
import { addEvent } from "./event";

function render(vdom, container) {
  mount(vdom, container);
}

function mount(vdom, container) {
  let newDOM = createDOM(vdom);
  container.appendChild(newDOM);
}

function createDOM(vdom) {
  let dom;
  if (typeof vdom === "string" || typeof vdom === "number") {
    return document.createTextNode(vdom);
  }
  let { type, props, ref } = vdom;

  if (type === REACT_TEXT) {
    dom = document.createTextNode(props.content);
  } else if (typeof type === "function") {
    if (type.isReactComponent) {
      return mountClassComponent(vdom);
    } else {
      return mountFunctionComponent(vdom);
    }
  } else {
    dom = document.createElement(type);
  }

  if (props) {
    updateProps(dom, {}, props);
    if (typeof props.children === "object" && props.children.type) {
      render(props.children, dom);
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    } else if (props.children) {
      render(props.children, dom);
    }
  }

  vdom.dom = dom;
  if (ref) {
    ref.current = dom;
  }
  return dom;
}

function mountClassComponent(vdom) {
  const { type, props, ref } = vdom;
  let classComponentInstance = new type({ ...props });
  if (classComponentInstance.componentWillMount) {
    classComponentInstance.componentWillMount();
  }
  const renderVdom = classComponentInstance.render();
  classComponentInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom;
  if (ref) {
    ref.current = classComponentInstance;
  }
  if (classComponentInstance.componentDidMount) {
    classComponentInstance.componentDidMount();
  }
  return createDOM(renderVdom);
}

function mountFunctionComponent(vdom) {
  const { type, props } = vdom;
  const renderVdom = type(props);
  vdom.oldRenderVdom = renderVdom;
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
      addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
      // dom[key.toLocaleLowerCase()] = newProps[key];
    } else {
      if (newProps[key]) {
        dom[key] = newProps[key];
      }
    }
  }
}

export function findDOM(vdom) {
  let type = vdom.type;
  let dom;
  if (typeof type === "string" || type === REACT_TEXT) {
    dom = vdom.dom;
  } else {
    dom = findDOM(vdom.oldRenderVdom);
  }
  return dom;
}

export function compareTwoVdom(parentDom, oldVdom, newVdom) {
  const oldDom = findDOM(oldVdom);
  const newDom = createDOM(newVdom);
  parentDom.replaceChild(newDom, oldDom);
}

const ReactDOM = {
  render,
};

export default ReactDOM;
