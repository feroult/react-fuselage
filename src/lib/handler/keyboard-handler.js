import keymaster from 'keymaster';

const UNDO_KEYS = '⌘+z, ctrl+z';

class KeyboardHandler {

    constructor(handler) {
        this.handler = handler;
        this.contexts = [];
        this.pushContext(new EditorContext(handler));
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

    constructor(handler) {
        super();
        this.addKey(UNDO_KEYS, handler.undoRedo.popUndo);
    }
}

export default KeyboardHandler;
