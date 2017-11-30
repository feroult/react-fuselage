import StateHandler from './state-handler';
import KeyboardHandler from './keyboard-handler';
import UndoRedoHandler from './undo-redo-handler';

class Handler {
    constructor(value) {
        this._value = value;
        this.stateHandler = new StateHandler(this);
        this.keyboardHandler = new KeyboardHandler(this);
        this.undoRedoHandler = new UndoRedoHandler(this);
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }
}


export {Handler};