import React from 'react';
import * as mobx from 'mobx';

import '../helper';
import {expect} from 'chai';

import UndoRedo from '../../lib/handler/undo-redo';

describe('UndoRedoHandler', () => {
    it('can undo deep object changes', () => {
        const budget = mobx.observable({sprints: [{info: {name: 'dev'}}]});
        const undoRedo = new UndoRedo(budget, {});

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
        const undoRedo = new UndoRedo(budget, {});

        expect(budget.sprints[0].name).to.be.equal('dev');

        budget.sprints[0].name = 'homolog';
        expect(budget.sprints[0].name).to.be.equal('homolog');

        undoRedo.popUndo();
        expect(budget.sprints[0].name).to.be.equal('dev');

        undoRedo.popRedo();
        expect(budget.sprints[0].name).to.be.equal('homolog');
    });

    it('undo/redo many times', () => {
        const budget = mobx.observable({sprints: [{name: 'dev'}]});
        const undoRedo = new UndoRedo(budget, {});

        budget.sprints.push({name: ''});
        expect(budget.sprints.length).to.be.equal(2);
        expect(budget.sprints[1].name).to.be.equal('');

        undoRedo.startEditing();
        budget.sprints[1].name = 'homolog';
        undoRedo.stopEditing();

        expect(budget.sprints[1].name).to.be.equal('homolog');

        undoRedo.popUndo();
        expect(budget.sprints[1].name).to.be.equal('');

        undoRedo.popRedo();
        expect(budget.sprints[1].name).to.be.equal('homolog');

        undoRedo.popUndo();
        expect(budget.sprints[1].name).to.be.equal('');

        undoRedo.popRedo();
        expect(budget.sprints[1].name).to.be.equal('homolog');
    });

    it.only('undo/redo twice in a row', () => {
        const budget = mobx.observable({sprints: [{name: 'dev'}, {name: 'homolog'}]});
        const undoRedo = new UndoRedo(budget, {});

        budget.sprints.push({name: ''});
        undoRedo.startEditing();

        undoRedo.stopEditing();
        budget.sprints.push({name: ''});
        undoRedo.startEditing();

        undoRedo.stopEditing();
        undoRedo.startEditing();
        budget.sprints[2].name = 'x';
        undoRedo.stopEditing();
        undoRedo.startEditing();
        budget.sprints[3].name = 'y';
        undoRedo.stopEditing();

        undoRedo.popUndo();
        undoRedo.popUndo();
        undoRedo.popUndo();
        undoRedo.popUndo();

        undoRedo.popRedo();
        undoRedo.startEditing();

        undoRedo.popRedo();
        undoRedo.startEditing();

        undoRedo.popRedo();
        undoRedo.popRedo();

        expect(budget.sprints[2].name).to.be.equal('x');
        expect(budget.sprints[3].name).to.be.equal('y');

        undoRedo.popUndo();

        expect(budget.sprints[2].name).to.be.equal('x');
        expect(budget.sprints[3].name).to.be.equal('');
    });

    it('undo/redo adding/removing items in a list', () => {
        const budget = mobx.observable({sprints: [{name: 'dev'}]});
        const undoRedo = new UndoRedo(budget, {});

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
        const undoRedo = new UndoRedo(budget, {});

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
