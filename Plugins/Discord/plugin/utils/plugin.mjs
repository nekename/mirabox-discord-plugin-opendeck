import { log } from './log.mjs';
import ws from 'ws';

class Plugins {
  static language = JSON.parse(process.argv[9]).application.language;
  static globalSettings = {};
  getGlobalSettingsFlag = true;
  constructor() {
    if (Plugins.instance) {
      return Plugins.instance;
    }
    // log.info("process.argv", process.argv);
    this.ws = new ws('ws://127.0.0.1:' + process.argv[3]);
    this.ws.on('open', () => {
      this.ws.send(JSON.stringify({ uuid: process.argv[5], event: process.argv[7] }));
      this.initFunction?.();
    });
    this.ws.on('close', process.exit);
    this.ws.on('message', (e) => {
      if (this.getGlobalSettingsFlag) {
        // Fetch only once
        this.getGlobalSettingsFlag = false;
        this.getGlobalSettings();
      }
      const data = JSON.parse(e.toString());
      const action = data.action?.split('.').pop();
      if (this[action]?.['dispatchFunction']) {
        this[action]?.['dispatchFunction']?.(data);
      } else {
        this[action]?.[data.event]?.(data);
      }

      if (data.event === 'didReceiveGlobalSettings') {
        this.globalSettings = data.payload.settings;
      }
      this[data.event]?.(data);
    });
    Plugins.instance = this;
    this.allAction = new Set();
    this.actionList = {};
  }

  setGlobalSettings(payload) {
    Plugins.globalSettings = payload;
    this.ws.send(
      JSON.stringify({
        event: 'setGlobalSettings',
        context: process.argv[5],
        payload,
      }),
    );
  }

  getGlobalSettings() {
    this.ws.send(
      JSON.stringify({
        event: 'getGlobalSettings',
        context: process.argv[5],
      }),
    );
  }
  // Set title
  setTitle(context, str, row = 0, num = 6) {
    let newStr = '';
    if (row && str) {
      let nowRow = 1,
        strArr = str.split('');
      strArr.forEach((item, index) => {
        if (nowRow < row && index >= nowRow * num) {
          nowRow++;
          newStr += '\n';
        }
        if (nowRow <= row && index < nowRow * num) {
          newStr += item;
        }
      });
      if (strArr.length > row * num) {
        newStr = newStr.substring(0, newStr.length - 1);
        newStr += '..';
      }
    }
    this.ws.send(
      JSON.stringify({
        event: 'setTitle',
        context,
        payload: {
          target: 0,
          title: newStr || str + '',
        },
      }),
    );
  }
  // Set background
  setImage(context, url) {
    this.ws.send(
      JSON.stringify({
        event: 'setImage',
        context,
        payload: {
          target: 0,
          image: url,
        },
      }),
    );
  }
  // Set state
  setState(context, state) {
    this.ws.send(
      JSON.stringify({
        event: 'setState',
        context,
        payload: { state },
      }),
    );
  }
  // Save persistent data
  setSettings(context, payload) {
    this.ws.send(
      JSON.stringify({
        event: 'setSettings',
        context,
        payload,
      }),
    );
  }

  // Show warning on key
  showAlert(context) {
    this.ws.send(
      JSON.stringify({
        event: 'showAlert',
        context,
      }),
    );
  }

  // Show success on key
  showOk(context) {
    this.ws.send(
      JSON.stringify({
        event: 'showOk',
        context,
      }),
    );
  }
  // Send to property inspector
  sendToPropertyInspector(payload) {
    this.ws.send(
      JSON.stringify({
        action: Actions.currentAction,
        context: Actions.currentContext,
        payload,
        event: 'sendToPropertyInspector',
      }),
    );
  }
  // Open web page with default browser
  openUrl(url) {
    this.ws.send(
      JSON.stringify({
        event: 'openUrl',
        payload: { url },
      }),
    );
  }
}

// Operation class
class Actions {
  constructor(data) {
    this.data = {};
    this.unsubscribe = {};
    Object.assign(this, data);
  }
  static dispatchFunction(data) {
    const actionName = data.action?.split('.').pop();
    let actionClass = null;
    if (actionName) {
      actionClass = Plugins.instance[actionName];
    }
    const actionList = Plugins.instance.actionList;
    if (data.event === 'willAppear') {
      if (!actionList[data.context]) {
        const instance = new actionClass();
        instance.context = data.context;
        instance.actionName = actionName;
        actionList[data.context] = instance;
      }
    }
    const eventNewName = `${data.event}New`;
    if (actionClass) {
      const instance = actionList[data.context];
      if (!instance) return;
      const method = instance[eventNewName] ?? instance[data.event];
      method?.call(instance, data);
    } else {
      Object.values(actionList).forEach((instance) => {
        const method = instance[eventNewName] ?? instance[data.event];
        method?.call(instance, data);
      });
    }
  }
  // When property inspector is displayed
  static currentAction = null;
  static currentContext = null;
  static actions = {};
  propertyInspectorDidAppear(data) {
    Actions.currentAction = data.action;
    Actions.currentContext = data.context;
    this._propertyInspectorDidAppear?.(data);
  }
  propertyInspectorDidAppearNew(data) {
    this._propertyInspectorDidAppear?.(data);
  }
  // Initialize data
  willAppearNew(data) {
    this.settings = data.payload.settings;
    Plugins.instance.allAction.add(data.context);
    this._willAppear?.(data);
    eventEmitter.emit('willAppear', data.context);
  }
  willAppear(data) {
    Plugins.globalContext = data.context;
    Actions.actions[data.context] = data.action;
    const {
      context,
      payload: { settings },
    } = data;
    this.data[context] = settings;
    Plugins.instance.allAction.add(data.context);
    this._willAppear?.(data);
    eventEmitter.emit('willAppear', data.context);
  }
  didReceiveSettingsNew(data) {
    this._didReceiveSettings?.(data);
  }
  didReceiveSettings(data) {
    this.data[data.context] = data.payload.settings;
    this._didReceiveSettings?.(data);
  }
  // Action destruction
  willDisappearNew(data) {
    eventEmitter.emit('willDisappear', data.context);
    this._willDisappear?.(data);
    Plugins.instance.allAction.delete(data.context);
    delete Plugins.instance.actionList[data.context];
  }
  willDisappear(data) {
    eventEmitter.emit('willDisappear', data.context);
    this._willDisappear?.(data);
    Plugins.instance.allAction.delete(data.context);
    delete this.data[data.context];
  }
}

class EventEmitter {
  constructor() {
    this.events = {};
  }

  // Subscribe to events
  subscribe(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    if (!(listener in this.events[event])) {
      this.events[event].push(listener);
    }
    return () => this.unsubscribe(event, listener);
  }

  // Unsubscribe
  unsubscribe(event, listenerToRemove) {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter((listener) => listener !== listenerToRemove);
  }

  // Publish event
  async emit(event, data) {
    if (!this.events[event]) return;
    for (const listener of this.events[event]) {
      if (listener) {
        try {
          // await listener(data);
          listener(data);
        } catch (error) {
          log.error(`error when emit ${event}:`, error);
        }
      }
    }
  }
}
let eventEmitter = new EventEmitter();
export { Plugins, Actions, eventEmitter, EventEmitter };
