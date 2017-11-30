import React from 'react';
import {Handler} from '../../lib/handler/handler';

import '../helper';
import {expect} from 'chai';

describe('UndoRedoHandler', () => {
    it('can undo deep object changes', () => {
        const handler = new Handler({sprints: [{info: {name: 'dev'}}]});
        const undoRedoHandler = handler.undoRedo;

        let budget = handler._value;

        expect(budget.sprints[0].info.name).to.be.equals('dev');
        budget.sprints[0].info.name = 'homolog 1';

        expect(budget.sprints[0].info.name).to.be.equals('homolog 1');
        budget.sprints[0].info.name = 'homolog 2';

        expect(budget.sprints[0].info.name).to.be.equals('homolog 2');
        undoRedoHandler.popUndo();
        expect(budget.sprints[0].info.name).to.be.equals('homolog 1');

        undoRedoHandler.popUndo();
        expect(budget.sprints[0].info.name).to.be.equals('dev');
    });

    it('redo changes', () => {
        const handler = new Handler({sprints: [{name: 'dev'}]});
        const undoRedoHandler = handler.undoRedo;

        let budget = handler._value;

        expect(budget.sprints[0].name).to.be.equals('dev');
        budget.sprints[0].name = 'homolog';

        expect(budget.sprints[0].name).to.be.equals('homolog');
        undoRedoHandler.popUndo();
        expect(budget.sprints[0].name).to.be.equals('dev');

        undoRedoHandler.popRedo();
        expect(budget.sprints[0].name).to.be.equals('homolog');
    });
});
