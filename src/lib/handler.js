import * as mobx from 'mobx';

class Handler {
    constructor(value) {
        this.value = value;
        this.undoHandler = new UndoHandler(this);
    }

    handleShortcuts(e) {
        const detector = new KeyDetector(e);

        if (detector.isCtrlOrMeta('z')) {
            console.log('undo');
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
        this.startTracking();
    }

    get valueJson() {
        return JSON.stringify(this.handler.value);
    }

    pushUndo(valueJson) {
        this.undo = this.undo || [];
        this.undo.push(valueJson);
        this.redo = [];
    }

    startTracking() {
        this.pushUndo(this.valueJson);

        this.removeTracker =
            mobx.reaction(
                () => this.valueJson,
                (valueJson) => {
                    this.pushUndo(valueJson);
                });
    }

}


export {Handler};