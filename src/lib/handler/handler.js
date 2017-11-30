import * as mobx from 'mobx';

import Keyboard from './keyboard';
import UndoRedo from './undo-redo';

class Handler {
    constructor(value) {
        this.observe(value);
        this.undoRedo = new UndoRedo(value);
        this.keyboard = new Keyboard(this.undoRedo);
    }

    observe(value) {
        this.value = value;
        if (!mobx.isObservable(value)) {
            mobx.extendObservable(value, value);
        }
    }

    onFocus = (event) => {
        if (event.target.type === 'text') {
            this.undoRedo.startEditing();
        }
    };

    onBlur = (event) => {
        if (event.target.type === 'text') {
            this.undoRedo.stopEditing();
        }
    };
}


export default Handler;