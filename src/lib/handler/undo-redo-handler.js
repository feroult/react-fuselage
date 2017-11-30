import * as mobx from 'mobx';

class UndoRedoHandler {

    constructor(value) {
        this.value = value;
        this.pushUndo(this.getValueAsJson());
        this.startTracking();
    }

    /**
     * Recover the existing value before the last change to to the underlying value.
     */
    popUndo = () => {
        if (this.undo.length < 2) {
            return;
        }
        this.pushRedo(this.undo.pop());
        this.setValueFromJson(this.undo[this.undo.length - 1]);
        this.stopEditing();
    };

    /**
     * Recover the existing value before the last call to popUndo.
     */
    popRedo = () => {
        if (this.redo.length === 0) {
            return;
        }
        const json = this.redo.pop();
        this.pushUndo(json, false);
        this.setValueFromJson(json);
    };

    getValueAsJson() {
        return JSON.stringify(this.value);
    }

    setValueFromJson(json) {
        this.stopTracking();
        Object.assign(this.value, JSON.parse(json));
        this.startTracking();
    };

    pushUndo(json, redoReset = true) {
        if (this.editing) {
            if (this.holding) {
                this.undo[this.undo.length - 1] = json;
                return;
            }
            this.holding = true;
        }

        this.undo = this.undo || [];
        this.undo.push(json);
        if (redoReset) {
            this.redo = [];
        }
    }

    pushRedo(json) {
        this.redo.push(json);
    }

    startTracking() {
        this.removeTracker =
            mobx.reaction(
                () => this.getValueAsJson(),
                (json) => this.pushUndo(json));
    }

    stopTracking() {
        this.removeTracker();
    }

    startEditing() {
        this.editing = true;
        this.holding = false;
    }

    stopEditing() {
        this.editing = false;
        this.holding = false;
    }
}

export default UndoRedoHandler;