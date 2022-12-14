import { findDOM, compareTwoVdom } from "./react-dom";
import { shallowEqual } from "./utils";

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

  emitUpdate(nextProps) {
    if (nextProps) {
      this.nextProps = nextProps;
    }
    if (updateQueue.isBatchingUpdate) {
      updateQueue.updaters.push(this);
    } else {
      this.updateComponent();
    }
  }

  updateComponent() {
    let { componentInstance, pendingStates, nextProps } = this;
    if (nextProps || pendingStates.length > 0) {
      shouldUpdate(componentInstance, nextProps, this.getState());
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

function shouldUpdate(componentInstance, nextProps, nextState) {
  let willUpdate = true;
  if (
    componentInstance.shouldComponentUpdate &&
    !componentInstance.shouldComponentUpdate(nextProps, nextState)
  ) {
    willUpdate = false;
  }
  if (willUpdate && componentInstance.componentWillUpdate) {
    componentInstance.componentWillUpdate();
  }
  if (nextProps) {
    componentInstance.props = nextProps;
  }
  if (componentInstance.constructor.getDerivedStateFromProps) {
    let nextState = componentInstance.constructor.getDerivedStateFromProps(
      nextProps,
      componentInstance.state
    );
    if (nextState) {
      componentInstance.state = nextState;
    }
  } else {
    componentInstance.state = nextState;
  }

  if (willUpdate) {
    componentInstance.forceUpdate();
  }
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
   * ????????????
   * 1. ?????? ???????????? DOM
   * 2. ???????????????????????????????????????????????? DOM
   * 3. ???????????????????????????????????????????????????????????? DOM ???
   */
  forceUpdate() {
    // console.log("????????????", this.state);
    let oldRenderVdom = this.oldRenderVdom;
    // ?????????????????? DOM ????????????????????? DOM
    let oldDom = findDOM(oldRenderVdom);
    if (this.constructor.contextType) {
      this.context = this.constructor.contextType._currentValue;
    }
    let newRenderVdom = this.render();
    let extraArgs;
    if (this.getSnapshotBeforeUpdate) {
      extraArgs = this.getSnapshotBeforeUpdate();
    }
    compareTwoVdom(oldDom.parentNode, oldRenderVdom, newRenderVdom);
    this.oldRenderVdom = newRenderVdom;
    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state, extraArgs);
    }
  }
}

export class PureComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }
}
