import React from 'react';
import * as mobx from 'mobx';

import '../helper';
import {expect} from 'chai';

import UndoRedoHandler from '../../lib/handler/undo-redo-handler';

describe('UndoRedoHandler', () => {
    it('can undo deep object changes', () => {
        const budget = mobx.observable({sprints: [{info: {name: 'dev'}}]});
        const undoRedo = new UndoRedoHandler(budget);

        expect(budget.sprints[0].info.name).to.be.equals('dev');
        budget.sprints[0].info.name = 'homolog 1';

        expect(budget.sprints[0].info.name).to.be.equals('homolog 1');

        budget.sprints[0].info.name = 'homolog 2';
        expect(budget.sprints[0].info.name).to.be.equals('homolog 2');

        undoRedo.popUndo();
        expect(budget.sprints[0].info.name).to.be.equals('homolog 1');

        undoRedo.popUndo();
        expect(budget.sprints[0].info.name).to.be.equals('dev');
    });

    it('redo changes', () => {
        const budget = mobx.observable({sprints: [{name: 'dev'}]});
        const undoRedo = new UndoRedoHandler(budget);

        expect(budget.sprints[0].name).to.be.equals('dev');
        budget.sprints[0].name = 'homolog';

        expect(budget.sprints[0].name).to.be.equals('homolog');
        undoRedo.popUndo();
        expect(budget.sprints[0].name).to.be.equals('dev');

        undoRedo.popRedo();
        expect(budget.sprints[0].name).to.be.equals('homolog');
    });
});
