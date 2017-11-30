import * as mobx from 'mobx';

class Handler {
    constructor(value) {
        this.value = value;
        this.stateHandler = new StateHandler(this);
        this.keyboardHandler = new KeyboardHandler(this);
        this.undoRedoHandler = new UndoRedoHandler(this);
    }
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

class KeyboardHandler {
    constructor(handler) {
        this.handler = handler;
    }

}

class UndoRedoHandler {

    constructor(handler) {
        this.handler = handler;
        this.pushUndo(this.getValueAsJson());
        this.startTracking();
    }

    getValueAsJson() {
        return JSON.stringify(this.handler.value);
    }

    setValueFromJson(json) {
        this.stopTracking();
        Object.assign(this.handler.value, JSON.parse(json));
        this.startTracking();
    };

    pushUndo(json, redoReset = true) {
        this.undo = this.undo || [];
        this.undo.push(json);
        if (redoReset) {
            this.redo = [];
        }
    }

    popUndo() {
        if (this.undo.length < 2) {
            return;
        }
        this.pushRedo(this.undo.pop());
        this.setValueFromJson(this.undo[this.undo.length - 1]);
    }

    pushRedo(json) {
        this.redo.push(json);
    }

    popRedo() {
        if (this.redo.length === 0) {
            return;
        }
        const json = this.redo.pop();
        this.pushUndo(json, false);
        this.setValueFromJson(json);
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