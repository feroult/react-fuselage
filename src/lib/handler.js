import * as mobx from 'mobx';

class Handler {
    constructor(value) {
        this.value = value;
        this.stateHandler = new StateHandler(this);
        this.undoHandler = new UndoHandler(this);
    }

    handleShortcuts = (event) => {
        const detector = new KeyDetector(event);

        if (detector.isCtrlOrMeta('x')) {
            event.preventDefault();
            this.undoHandler.popUndo();
        }
    };
}

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

class KeyDetector {
    constructor(event) {
        this.event = event;
    }

    isCtrlOrMeta = (key) =>
        this.event.key === key && (this.event.ctrlKey || this.event.metaKey);
}

class UndoHandler {

    constructor(handler) {
        this.handler = handler;
        this.pushUndo(this.getValueAsJson());
        this.startTracking();
    }

    getValueAsJson = () => JSON.stringify(this.handler.value);

    setValueFromJson = (json) => this.handler.value = JSON.parse(json);

    pushUndo(valueJson) {
        console.log('pushUndo');
        this.undo = this.undo || [];
        this.undo.push(valueJson);
        this.redo = [];
    }

    popUndo() {
        console.log('popUndo');
        if (this.undo.length < 2) {
            return;
        }
        this.stopTracking();
        this.pushRedo(this.undo.pop());
        this.setValueFromJson(this.undo[this.undo.length - 1]);
        this.startTracking();
    }

    pushRedo(json) {
        this.redo.push(json);
    }

    startTracking() {
        this.removeTracker =
            mobx.reaction(
                () => this.getValueAsJson(),
                (json) => {
                    this.pushUndo(json);
                });
    }

    stopTracking() {
        this.removeTracker();
    }

}


export {Handler};