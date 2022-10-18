import { updateQueue } from "./component";

export function addEvent(dom, eventType, handler) {
  let store;
  if (!dom.store) {
    dom.store = {};
  }
  store = dom.store;
  store[eventType] = handler;
  if (!document[eventType]) {
    document[eventType] = dispatchEvent;
  }
}

function dispatchEvent(event) {
  let { target, type } = event;
  let eventType = `on${type}`;
  updateQueue.isBatchingUpdate = true;
  let syntheticEvent = createSyntheticEvent(event);
  // 找到target上面存储的store[eventType]，执行handler
  // 使用while， 是为了模拟事件冒泡的过程
  while (target) {
    let { store } = target;
    let handler = store && store[eventType];
    handler && handler.call(target, syntheticEvent);
    target = target.parentNode;
  }

  updateQueue.isBatchingUpdate = false;
  updateQueue.batchUpdate();
}

// 创建合成事件，可以做一些浏览器的兼容处理
function createSyntheticEvent(event) {
  let syntheticEvent = {};
  for (let key in event) {
    syntheticEvent[key] = event[key];
  }
  return syntheticEvent;
}
