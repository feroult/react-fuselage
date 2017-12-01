import * as mobx from 'mobx';

class UndoRedoHandler {

    constructor(value, state) {
        this.value = value;
        this.state = state;
        this.pushUndo(this.currentContext(), true);
        this.startTracking();
    }

    /**
     * Recover the existing value before the last change to to the underlying value.
     */
    popUndo = () => {
        this.stopEditing();

        if (this.undo.length < 2) {
            return;
        }
        this.pushRedo(this.undo.pop());
        this.restoreFrom(this.undo[this.undo.length - 1]);

    };

    /**
     * Recover the existing value before the last call to popUndo.
     */
    popRedo = () => {
        this.stopEditing();

        if (this.redo.length === 0) {
            return;
        }
        const context = this.redo.pop();
        this.pushUndo(context, false);
        this.restoreFrom(context);
    };

    getValueAsJson() {
        return JSON.stringify(this.value);
    }

    getStateAsJson() {
        return JSON.stringify(this.state);
    }

    currentContext() {
        return {
            state: this.getStateAsJson(),
            value: this.getValueAsJson()
        };
    }

    restoreFrom(context) {
        this.setStateFromJson(context.state);
        this.setValueFromJson(context.value);
    }

    setStateFromJson(json) {
        Object.assign(this.state, JSON.parse(json));
    }

    setValueFromJson(json) {
        this.stopTracking();
        Object.assign(this.value, JSON.parse(json));
        this.startTracking();
    }

    pushUndo(context, redoReset) {
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

    pushRedo(context) {
        this.redo.push(context);
    }

    startTracking() {
        this.removeTracker =
            mobx.reaction(
                () => this.getValueAsJson(),
                () => this.pushUndo(this.currentContext(), true));
    }

    stopTracking() {
        this.removeTracker();
    }

    startEditing() {
        // console.log('start');
        this.editing = true;
        this.holding = false;
    }

    stopEditing() {
        // console.log('stop');
        this.editing = false;
        this.holding = false;
    }
}

export default UndoRedoHandler;