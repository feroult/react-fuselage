import * as mobx from 'mobx';

import KeyboardHandler from './keyboard-handler';
import UndoRedoHandler from './undo-redo-handler';

class Handler {
    constructor(value) {
        this.observe(value);
        this.undoRedo = new UndoRedoHandler(value);
        this.keyboard = new KeyboardHandler(this.undoRedo);
    }

    observe(value) {
        this.value = value;
        if (!mobx.isObservable(value)) {
            mobx.extendObservable(value, value);
        }
    }

    onFocus(event) {
        if (event.target.type === 'text') {
            // this.undoRedo.startEditing();
        }
    }

    onBlur(event) {
        if (event.target.type === 'text') {
            // this.undoRedo.stopEditing();
        }
    }

}


export {Handler};