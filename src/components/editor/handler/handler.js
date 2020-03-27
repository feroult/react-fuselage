import * as mobx from 'mobx';

import Keyboard from './keyboard';
import UndoRedo from './undo-redo';
import Validator from './validator';

const initialState = {
    tab: 0
};

class Handler {
    constructor(value, state = initialState) {
        this.state = mobx.extendObservable({}, state);
        this.value = mobx.extendObservable({}, value);
        this.undoRedo = new UndoRedo(this.value, this.state);
        this.keyboard = new Keyboard(this.undoRedo);
        this.validator = new Validator();
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