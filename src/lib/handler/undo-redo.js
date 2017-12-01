import * as mobx from 'mobx';

class UndoRedoHandler {

    constructor(value, state) {
        this.value = value;
        this.state = state;
        this.pushUndo();
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
        this.restoreFrom(this.undo[this.undo.length - 1]);
        this.stopEditing();
    };

    /**
     * Recover the existing value before the last call to popUndo.
     */
    popRedo = () => {
        if (this.redo.length === 0) {
            return;
        }
        const context = this.redo.pop();
        this.pushUndo(false);
        this.restoreFrom(context);
    };

    getValueAsJson() {
        return JSON.stringify(this.value);
    }

    getStateAsJson() {
        return JSON.stringify(this.state);
    }

    restoreFrom(context) {
        this.setValueFromJson(context.value);
    }

    setValueFromJson(json) {
        this.stopTracking();
        Object.assign(this.value, JSON.parse(json));
        this.startTracking();
    };

    pushUndo(redoReset = true) {
        const context = {
            state: this.getStateAsJson(),
            value: this.getValueAsJson()
        };

        if (this.editing) {
            if (this.holding) {
                this.undo[this.undo.length - 1] = context;
                return;
            }
            this.holding = true;
        }

        this.undo = this.undo || [];
        this.undo.push(context);
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
                () => this.pushUndo());
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