import * as mobx from 'mobx';

import StateHandler from './state-handler';
import KeyboardHandler from './keyboard-handler';
import UndoRedoHandler from './undo-redo-handler';

class Handler {
    constructor(value) {
        this.observe(value);
        this.stateHandler = new StateHandler(this);
        this.undoRedoHandler = new UndoRedoHandler(this);
        this.keyboardHandler = new KeyboardHandler(this);
    }

    observe(value) {
        this._value = value;
        if (!mobx.isObservable(value)) {
            mobx.extendObservable(value, value);
        }
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

}


export {Handler};