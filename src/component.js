import { findDOM, compareTwoVdom } from "./react-dom";

export const updateQueue = {
  isBatchingUpdate: false,
  updaters: [],
  batchUpdate() {
    for (let updater of updateQueue.updaters) {
      updater.updateComponent();
    }
    updateQueue.isBatchingUpdate = false;
    updateQueue.updaters.length = 0;
  },
};

class Updater {
  constructor(componentInstance) {
    this.componentInstance = componentInstance;
    this.pendingStates = [];
    this.callbacks = [];
  }

  addState(partialState, callback) {
    this.pendingStates.push(partialState);
    if (typeof callback === "function") {
      this.callbacks.push(callback);
    }
    this.emitUpdate();
  }

  emitUpdate() {
    if (updateQueue.isBatchingUpdate) {
      updateQueue.updaters.push(this);
    } else {
      this.updateComponent();
    }
  }

  updateComponent() {
    let { componentInstance, pendingStates } = this;
    if (pendingStates.length > 0) {
      shouldUpdate(componentInstance, this.getState());
    }
  }

  getState() {
    let { componentInstance, pendingStates } = this;
    let { state } = componentInstance;
    pendingStates.forEach((nextState) => {
      if (typeof nextState === "function") {
        nextState = nextState(state);
      }
      state = { ...state, ...nextState };
    });
    pendingStates.length = 0;

    return state;
  }
}

function shouldUpdate(componentInstance, nextState) {
  componentInstance.state = nextState;
  componentInstance.forceUpdate();
}
export class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.updater = new Updater(this);
    this.state = {};
    this.oldRenderVdom = null;
  }

  setState(partialState, callback) {
    this.updater.addState(partialState, callback);
  }

  /**
   * 更新组件
   * 1. 获取 老的虚拟 DOM
   * 2. 根据最新的属性和状态生成新的虚拟 DOM
   * 3. 比较，查找差异，然后把这些差异同步到真实 DOM 上
   */
  forceUpdate() {
    // console.log("更新组件", this.state);
    let oldRenderVdom = this.oldRenderVdom;
    // 根据老的虚拟 DOM 查找到老的真实 DOM
    let oldDom = findDOM(oldRenderVdom);
    let newRenderVdom = this.render();
    compareTwoVdom(oldDom.parentNode, oldRenderVdom, newRenderVdom);
    this.oldRenderVdom = newRenderVdom;
  }
}
