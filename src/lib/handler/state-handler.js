import * as mobx from 'mobx';

class StateHandler {
    constructor(handler) {
        this.handler = handler;
        this.observe();
    }

    observe() {
        const value = this.handler.value;
        if (!mobx.isObservable(value)) {
            mobx.extendObservable(value, value);
        }
    }
}

export default StateHandler;