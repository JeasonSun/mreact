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
    this.updateComponent();
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
  console.log("更新组件", componentInstance, nextState);
}
export class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.updater = new Updater(this);
    this.state = {};
  }

  setState(partialState, callback) {
    this.updater.addState(partialState, callback);
  }
}
