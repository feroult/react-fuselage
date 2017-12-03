import * as mobx from 'mobx';

class UndoRedo {

    constructor(value, state) {
        this.value = value;
        this.state = state;
        this._pushUndo(this._currentContext(), true);
        this._startTracking();
    }

    /**
     * Recover the existing value before the last change to the underlying value.
     */
    undo = () => {
        this.stopEditing();

        if (this._undo.length < 2) {
            return;
        }
        this._pushRedo(this._undo.pop());
        this._restoreFrom(this._undo[this._undo.length - 1]);

    };

    /**
     * Recover the existing value before the last call to popUndo.
     */
    redo = () => {
        this.stopEditing();

        if (this._redo.length === 0) {
            return;
        }
        const context = this._redo.pop();
        this._pushUndo(context, false);
        this._restoreFrom(context);
    };

    /**
     * Start grouping next changes into a single change
     */
    startEditing() {
        this.editing = true;
        this.holding = false;
    }

    /**
     * Stop grouping changes.
     */
    stopEditing() {
        this.editing = false;
        this.holding = false;
    }

    _getValueAsJson() {
        return JSON.stringify(this.value);
    }

    _getStateAsJson() {
        return JSON.stringify(this.state);
    }

    _currentContext() {
        return {
            state: this._getStateAsJson(),
            value: this._getValueAsJson()
        };
    }

    _restoreFrom(context) {
        this._setStateFromJson(context.state);
        this._setValueFromJson(context.value);
    }

    _setStateFromJson(json) {
        Object.assign(this.state, JSON.parse(json));
    }

    _setValueFromJson(json) {
        this._stopTracking();
        Object.assign(this.value, JSON.parse(json));
        this._startTracking();
    }

    _pushUndo(context, redoReset) {
        if (this.editing) {
            if (this.holding) {
                this._undo[this._undo.length - 1] = context;
                return;
            }
            this.holding = true;
        }

        this._undo = this._undo || [];
        this._undo.push(context);
        if (redoReset) {
            this._redo = [];
        }
    }

    _pushRedo(context) {
        this._redo.push(context);
    }

    _startTracking() {
        this.removeTracker =
            mobx.reaction(
                () => this._getValueAsJson(),
                () => this._pushUndo(this._currentContext(), true));
    }

    _stopTracking() {
        this.removeTracker();
    }

}

export default UndoRedo;