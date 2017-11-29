class Handler {
    constructor(value) {
        this.value = value;
        this.undoHandler = new UndoHandler();
    }

    handleShortcuts(e) {
        const detector = new KeyDetector(e);

        if (detector.isCtrlOrMeta('z')) {
            console.log('undo');
        }
    }
}

class KeyDetector {
    constructor(event) {
        this.event = event;
    }

    isCtrlOrMeta = (key) =>
        this.event.key === key && (this.event.ctrlKey || this.event.metaKey);
}

class UndoHandler {
    undo(e) {
        console.log('undo', e);
    }
}

export {Handler};