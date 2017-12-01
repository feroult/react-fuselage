import * as mobx from 'mobx';

import Keyboard from './keyboard';
import UndoRedo from './undo-redo';

class Handler {
    constructor(value, state = {}) {
        this.value = this._observe(value);
        this.state = this._observe(state);
        this.undoRedo = new UndoRedo(value, state);
        this.keyboard = new Keyboard(this.undoRedo);
    }

    _observe(value) {
        if (!mobx.isObservable(value)) {
            mobx.extendObservable(value, value);
        }
        return value;
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