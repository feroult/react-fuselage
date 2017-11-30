import keymaster from 'keymaster';

const UNDO_SHORTCUTS = '⌘+z, ctrl+z';

class KeyboardHandler {

    constructor(undoRedo) {
        this.contexts = [];
        this.pushContext(new EditorContext(undoRedo));
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
        this.addKey(UNDO_SHORTCUTS, undoRedo.popUndo);
    }
}

export default KeyboardHandler;
