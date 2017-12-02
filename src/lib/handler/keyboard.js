import keymaster from 'keymaster';

const UNDO_SHORTCUTS = '⌘+z, ctrl+z';
const REDO_SHORTCUTS = '⌘+shift+z, ctrl+shift+z';


class KeyboardHandler {

    constructor(undoRedo) {
        this.contexts = [];
        this.pushContext(new EditorContext(undoRedo));
        keymaster.filter = () => true;
    }

    pushContext(context) {
        context.bind();
        this.contexts.push(context);
    }

}

class KeyboardContext {

    bindings = {};

    addKey = (key, fn) => this.bindings[key] = fn;

    bind() {
        const bindings = this.bindings;
        const keys = Object.keys(bindings);
        keys.forEach((key) => {
            keymaster(key, bindings[key]);
        });
    }

}

class EditorContext extends KeyboardContext {

    constructor(undoRedo) {
        super();
        this.addKey(UNDO_SHORTCUTS, undoRedo.undo);
        this.addKey(REDO_SHORTCUTS, undoRedo.redo);
    }
}

export default KeyboardHandler;
