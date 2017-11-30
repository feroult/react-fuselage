import React from 'react';
import * as mobx from 'mobx';

import '../helper';
import {expect} from 'chai';

import UndoRedoHandler from '../../lib/handler/undo-redo-handler';

describe('UndoRedoHandler', () => {
    it('can undo deep object changes', () => {
        const budget = mobx.observable({sprints: [{info: {name: 'dev'}}]});
        const undoRedo = new UndoRedoHandler(budget);

        expect(budget.sprints[0].info.name).to.be.equal('dev');

        budget.sprints[0].info.name = 'homolog 1';
        expect(budget.sprints[0].info.name).to.be.equal('homolog 1');

        budget.sprints[0].info.name = 'homolog 2';
        expect(budget.sprints[0].info.name).to.be.equal('homolog 2');

        undoRedo.popUndo();
        expect(budget.sprints[0].info.name).to.be.equal('homolog 1');

        undoRedo.popUndo();
        expect(budget.sprints[0].info.name).to.be.equal('dev');
    });

    it('redo changes', () => {
        const budget = mobx.observable({sprints: [{name: 'dev'}]});
        const undoRedo = new UndoRedoHandler(budget);

        expect(budget.sprints[0].name).to.be.equal('dev');

        budget.sprints[0].name = 'homolog';
        expect(budget.sprints[0].name).to.be.equal('homolog');

        undoRedo.popUndo();
        expect(budget.sprints[0].name).to.be.equal('dev');

        undoRedo.popRedo();
        expect(budget.sprints[0].name).to.be.equal('homolog');
    });

    it('undo/redo adding/removing items in a list', () => {
        const budget = mobx.observable({sprints: [{name: 'dev'}]});
        const undoRedo = new UndoRedoHandler(budget);

        expect(budget.sprints.length).to.be.equal(1);

        for (let i = 0; i < 5; i++) {
            budget.sprints.push({});
        }
        expect(budget.sprints.length).to.be.equal(6);

        for (let i = 0; i < 5; i++) {
            undoRedo.popUndo();
        }
        expect(budget.sprints.length).to.be.equal(1);

        for (let i = 0; i < 5; i++) {
            undoRedo.popRedo();
        }
        expect(budget.sprints.length).to.be.equal(6);
    });

    it('considers single editions as one change', () => {
        const budget = mobx.observable({sprints: [{name: 'homolog'}]});
        const undoRedo = new UndoRedoHandler(budget);

        expect(budget.sprints[0].name).to.be.equal('homolog');

        undoRedo.startEditing();
        budget.sprints[0].name = 'd';
        budget.sprints[0].name = 'de';
        budget.sprints[0].name = 'dev';
        undoRedo.stopEditing();

        undoRedo.popUndo();
        expect(budget.sprints[0].name).to.be.equal('homolog');
    });

});
