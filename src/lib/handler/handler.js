import * as mobx from 'mobx';

import StateHandler from './state-handler';
import KeyboardHandler from './keyboard-handler';
import UndoRedoHandler from './undo-redo-handler';

class Handler {
    constructor(value) {
        this.observe(value);
        this.state = new StateHandler(this);
        this.undoRedo = new UndoRedoHandler(this);
        this.keyboard = new KeyboardHandler(this);
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

    onFocus(event) {
        if (event.target.type === 'text') {
            this.state.startEditing();
        }
    }

    onBlur(event) {
        if (event.target.type === 'text') {
            this.state.stopEditing();
            // /this.undoRedo.stopEditing();
        }
    }

}


export {Handler};