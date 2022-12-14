import {
  REACT_CONTEXT,
  REACT_FORWARD_REF_TYPE,
  REACT_MEMO,
  REACT_PROVIDE,
  REACT_TEXT,
} from "./constants";
import { addEvent } from "./event";

let hookState = [];
let hookIndex = 0;
let scheduleUpdate;

function render(vdom, container) {
  mount(vdom, container);
  scheduleUpdate = () => {
    hookIndex = 0;
    compareTwoVdom(container, vdom, vdom);
  };
}

export function useReducer(reducer, initialState) {
  hookState[hookIndex] = hookState[hookIndex] || initialState;
  const currentIndex = hookIndex;
  const dispatch = (action) => {
    hookState[currentIndex] = reducer
      ? reducer(hookState[currentIndex], action)
      : action;
    scheduleUpdate();
  };
  return [hookState[hookIndex++], dispatch];
}

export function useState(initialState) {
  return useReducer(null, initialState);
}

// export function useState(initialState) {
//   hookState[hookIndex] = hookState[hookIndex] || initialState;
//   const currentIndex = hookIndex;
//   const setState = (newState) => {
//     hookState[currentIndex] = newState;
//     scheduleUpdate();
//   };
//   return [hookState[hookIndex++], setState];
// }

export function useMemo(factory, deps) {
  if (hookState[hookIndex]) {
    // 已经存在记录
    const [lastMemo, lastDeps] = hookState[hookIndex];
    const same = deps.every((dep, index) => dep === lastDeps[index]);
    if (same) {
      hookIndex++;
      return lastMemo;
    } else {
      const newMemo = factory();
      hookState[hookIndex++] = [newMemo, deps];
      return newMemo;
    }
  } else {
    const newMemo = factory();
    hookState[hookIndex++] = [newMemo, deps];
    return newMemo;
  }
}

export function useCallback(callback, deps) {
  if (hookState[hookIndex]) {
    const [lastCallback, lastDeps] = hookState[hookIndex];
    const same = deps.every((dep, index) => dep === lastDeps[index]);
    if (same) {
      hookIndex++;
      return lastCallback;
    } else {
      hookState[hookIndex++] = [callback, deps];
      return callback;
    }
  } else {
    hookState[hookIndex++] = [callback, deps];
    return callback;
  }
}

export function useContext(context) {
  return context._currentValue;
}

export function useEffect(callback, deps) {
  if (hookState[hookIndex]) {
    const [lastDestroy, lastDeps] = hookState[hookIndex];
    const same = deps.every((dep, index) => dep === lastDeps[index]);
    if (same) {
      // 如果依赖没有变更， 不再执行
      hookIndex++;
    } else {
      lastDestroy && lastDestroy();
      setTimeout(() => {
        const destroy = callback();
        hookState[hookIndex++] = [destroy, deps];
      });
    }
  } else {
    setTimeout(() => {
      const destroy = callback(); // callback的返回值，就是destroy 函数
      hookState[hookIndex++] = [destroy, deps];
    });
  }
}

export function useLayoutEffect(callback, deps) {
  if (hookState[hookIndex]) {
    const [lastDestroy, lastDeps] = hookState[hookIndex];
    const same = deps.every((dep, index) => dep === lastDeps[index]);
    if (same) {
      // 如果依赖没有变更， 不再执行
      hookIndex++;
    } else {
      lastDestroy && lastDestroy();
      queueMicrotask(() => {
        const destroy = callback();
        hookState[hookIndex++] = [destroy, deps];
      });
    }
  } else {
    queueMicrotask(() => {
      const destroy = callback(); // callback的返回值，就是destroy 函数
      hookState[hookIndex++] = [destroy, deps];
    });
  }
}

export function useRef() {
  if (hookState[hookIndex]) {
    return hookState[hookIndex++];
  } else {
    hookState[hookIndex] = { current: null };
    return hookState[hookIndex++];
  }
}



function mount(vdom, container) {
  let newDOM = createDOM(vdom);
  container.appendChild(newDOM);
  if (newDOM.componentDidMount) {
    newDOM.componentDidMount();
  }
}

function createDOM(vdom) {
  let dom;
  if (typeof vdom === "string" || typeof vdom === "number") {
    return document.createTextNode(vdom);
  }
  let { type, props, ref } = vdom;
  if (type && type.$$typeof === REACT_MEMO) {
    return mountMemoComponent(vdom);
  } else if (type && type.$$typeof === REACT_CONTEXT) {
    return mountContextComponent(vdom);
  } else if (type && type.$$typeof === REACT_PROVIDE) {
    return mountProviderComponent(vdom);
  } else if (type && type.$$typeof === REACT_FORWARD_REF_TYPE) {
    return mountForwardComponent(vdom);
  } else if (type === REACT_TEXT) {
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
function mountMemoComponent(vdom) {
  const { type, props } = vdom;
  let renderVdom = type.type(props);
  vdom.prevProps = props;
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

function mountForwardComponent(vdom) {
  const { type, props, ref } = vdom;
  let renderVdom = type.render(props, ref);
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

function mountContextComponent(vdom) {
  // Consumer
  const { type, props } = vdom;
  const renderVdom = props.children(type._context._currentValue);
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

function mountProviderComponent(vdom) {
  // Provider
  const { type, props } = vdom;
  type._context._currentValue = props.value;
  let renderVdom = props.children;
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

function mountClassComponent(vdom) {
  const { type, props, ref } = vdom;
  let classComponentInstance = new type({ ...props });
  vdom.classComponentInstance = classComponentInstance;
  if (classComponentInstance.componentWillMount) {
    classComponentInstance.componentWillMount();
  }
  if (type.getDerivedStateFromProps) {
    let nextState = type.getDerivedStateFromProps(
      props,
      classComponentInstance.state
    );
    if (nextState) {
      classComponentInstance.state = nextState;
    }
  }
  // 类存在静态属性contextType
  if (type.contextType) {
    classComponentInstance.context = type.contextType._currentValue;
  }

  const renderVdom = classComponentInstance.render();
  classComponentInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom;
  if (ref) {
    ref.current = classComponentInstance;
  }

  let dom = createDOM(renderVdom);

  if (classComponentInstance.componentDidMount) {
    dom.componentDidMount = classComponentInstance.componentDidMount.bind(
      classComponentInstance
    );
  }
  return dom;
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

export function compareTwoVdom(parentDom, oldVdom, newVdom, nextDOM) {
  // const oldDom = findDOM(oldVdom);
  // const newDom = createDOM(newVdom);
  // parentDom.replaceChild(newDom, oldDom);
  if (!oldVdom && !newVdom) {
    return null;
  }
  if (oldVdom && !newVdom) {
    // 老的存在，新的不存在了，那么就卸载老的
    let currentDOM = findDOM(oldVdom);
    currentDOM.parentNode.removeChild(currentDOM);
    if (
      oldVdom.classComponentInstance &&
      oldVdom.classComponentInstance.componentWillUnmount
    ) {
      oldVdom.classComponentInstance.componentWillUnmount();
    }
    return null;
  }

  if (!oldVdom && newVdom) {
    // 老的不存在，新的存在
    let newDOM = createDOM(newVdom);
    if (nextDOM) {
      parentDom.insertBefore(newDOM, nextDOM);
    } else {
      parentDom.appendChild(newDOM);
    }

    if (newDOM.componentDidMount) {
      newDOM.componentDidMount();
    }
    return newVdom;
  }

  if (oldVdom && newVdom && oldVdom.type !== newVdom.type) {
    let oldDom = findDOM(oldVdom);
    let newDom = createDOM(newVdom);
    oldDom.parentNode.replaceChild(newDom, oldDom);
    if (
      oldVdom.classComponentInstance &&
      oldVdom.classComponentInstance.componentWillUnmount
    ) {
      oldVdom.classComponentInstance.componentWillUnmount();
    }
    if (newDom.componentDidMount) {
      newDom.componentDidMount();
    }
  } else {
    updateElement(oldVdom, newVdom);
  }
}

function updateElement(oldVdom, newVdom) {
  if (oldVdom.type && oldVdom.type.$$typeof === REACT_MEMO) {
    updateMemoComponent(oldVdom, newVdom);
  } else if (oldVdom.type && oldVdom.type.$$typeof === REACT_PROVIDE) {
    updateProviderComponent(oldVdom, newVdom);
  } else if (oldVdom.type && oldVdom.type.$$typeof === REACT_CONTEXT) {
    updateConsumerComponent(oldVdom, newVdom);
  } else if (oldVdom.type === REACT_TEXT && newVdom.type === REACT_TEXT) {
    let currentDOM = (newVdom.dom = findDOM(oldVdom));
    if (oldVdom.props.content !== newVdom.props.content) {
      currentDOM.textContent = newVdom.props.content;
    }
  } else if (typeof oldVdom.type === "string") {
    let currentDOM = (newVdom.dom = findDOM(oldVdom));
    updateProps(currentDOM, oldVdom.props, newVdom.props);
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (typeof oldVdom.type === "function") {
    if (oldVdom.type.isReactComponent) {
      updateClassComponent(oldVdom, newVdom);
    } else {
      updateFunctionComponent(oldVdom, newVdom);
    }
  }
}

function updateMemoComponent(oldVdom, newVdom) {
  let { type, prevProps } = oldVdom;
  if (type.compare(prevProps, newVdom.props)) {
    // 如果相等，不更新
    newVdom.oldRenderVdom = oldVdom.oldRenderVdom;
    newVdom.prevProps = oldVdom.prevProps;
  } else {
    let parentDOM = findDOM(oldVdom).parentNode;
    let oldRenderVdom = newVdom.type.type(newVdom.props);
    compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, oldRenderVdom);
    newVdom.oldRenderVdom = oldRenderVdom;
    newVdom.prevProps = newVdom.props;
  }
}

function updateProviderComponent(oldVdom, newVdom) {
  let parentDOM = findDOM(oldVdom).parentNode;
  let { type, props } = newVdom;
  type._context._currentValue = props.value;
  let renderVdom = props.children;
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
  newVdom.oldRenderVdom = renderVdom;
}

function updateConsumerComponent(oldVdom, newVdom) {
  let parentDOM = findDOM(oldVdom).parentNode;
  let { type, props } = newVdom;
  let renderVdom = props.children(type._context._currentValue);
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
  newVdom.oldRenderVdom = renderVdom;
}

function updateClassComponent(oldVdom, newVdom) {
  let classComponentInstance = (newVdom.classComponentInstance =
    oldVdom.classComponentInstance);
  newVdom.oldRenderVdom = oldVdom.oldRenderVdom;
  // 由于父级组件更新引起更新
  if (classComponentInstance.componentWillReceiveProps) {
    classComponentInstance.componentWillReceiveProps();
  }
  classComponentInstance.updater.emitUpdate(newVdom.props);
}

function updateFunctionComponent(oldVdom, newVdom) {
  let parentDOM = findDOM(oldVdom).parentNode;
  let { type, props } = newVdom;
  let renderVdom = type(props);
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
  newVdom.oldRenderVdom = renderVdom;
}

function updateChildren(parentDOM, oldVChildren, newVChildren) {
  oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren];
  newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren];
  let maxLength = Math.max(oldVChildren.length, newVChildren.length);
  for (let i = 0; i < maxLength; i++) {
    let nextVNode = oldVChildren.find(
      (item, index) => index > i && item && findDOM(item)
    );
    compareTwoVdom(
      parentDOM,
      oldVChildren[i],
      newVChildren[i],
      nextVNode && findDOM(nextVNode)
    );
  }
}

const ReactDOM = {
  render,
};

export default ReactDOM;
