import React from 'react';
import * as mobx from 'mobx';

import expect from 'expect';

import UndoRedo from 'src/handler/undo-redo';

describe('UndoRedoHandler', () => {
    it('can undo deep object changes', () => {
        const budget = mobx.observable({sprints: [{info: {name: 'dev'}}]});
        const undoRedo = new UndoRedo(budget, {});

        expect(budget.sprints[0].info.name).toEqual('dev');

        budget.sprints[0].info.name = 'homolog 1';
        expect(budget.sprints[0].info.name).toEqual('homolog 1');

        budget.sprints[0].info.name = 'homolog 2';
        expect(budget.sprints[0].info.name).toEqual('homolog 2');

        undoRedo.undo();
        expect(budget.sprints[0].info.name).toEqual('homolog 1');

        undoRedo.undo();
        expect(budget.sprints[0].info.name).toEqual('dev');
    });

    it('redo changes', () => {
        const budget = mobx.observable({sprints: [{name: 'dev'}]});
        const undoRedo = new UndoRedo(budget, {});

        expect(budget.sprints[0].name).toEqual('dev');

        budget.sprints[0].name = 'homolog';
        expect(budget.sprints[0].name).toEqual('homolog');

        undoRedo.undo();
        expect(budget.sprints[0].name).toEqual('dev');

        undoRedo.redo();
        expect(budget.sprints[0].name).toEqual('homolog');
    });

    it('undo/redo many times', () => {
        const budget = mobx.observable({sprints: [{name: 'dev'}]});
        const undoRedo = new UndoRedo(budget, {});

        budget.sprints.push({name: ''});
        expect(budget.sprints.length).toEqual(2);
        expect(budget.sprints[1].name).toEqual('');

        undoRedo.startEditing();
        budget.sprints[1].name = 'homolog';
        undoRedo.stopEditing();

        expect(budget.sprints[1].name).toEqual('homolog');

        undoRedo.undo();
        expect(budget.sprints[1].name).toEqual('');

        undoRedo.redo();
        expect(budget.sprints[1].name).toEqual('homolog');

        undoRedo.undo();
        expect(budget.sprints[1].name).toEqual('');

        undoRedo.redo();
        expect(budget.sprints[1].name).toEqual('homolog');
    });

    it('undo/redo twice in a row', () => {
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

        undoRedo.undo();
        undoRedo.undo();
        undoRedo.undo();
        undoRedo.undo();

        undoRedo.redo();
        undoRedo.startEditing();

        undoRedo.redo();
        undoRedo.startEditing();

        undoRedo.redo();
        undoRedo.redo();

        expect(budget.sprints[2].name).toEqual('x');
        expect(budget.sprints[3].name).toEqual('y');

        undoRedo.undo();

        expect(budget.sprints[2].name).toEqual('x');
        expect(budget.sprints[3].name).toEqual('');
    });

    it('undo/redo adding/removing items in a list', () => {
        const budget = mobx.observable({sprints: [{name: 'dev'}]});
        const undoRedo = new UndoRedo(budget, {});

        expect(budget.sprints.length).toEqual(1);

        for (let i = 0; i < 5; i++) {
            budget.sprints.push({});
        }
        expect(budget.sprints.length).toEqual(6);

        for (let i = 0; i < 5; i++) {
            undoRedo.undo();
        }
        expect(budget.sprints.length).toEqual(1);

        for (let i = 0; i < 5; i++) {
            undoRedo.redo();
        }
        expect(budget.sprints.length).toEqual(6);
    });

    it('considers single editions as one change', () => {
        const budget = mobx.observable({sprints: [{name: 'homolog'}]});
        const undoRedo = new UndoRedo(budget, {});

        expect(budget.sprints[0].name).toEqual('homolog');

        undoRedo.startEditing();
        budget.sprints[0].name = 'd';
        budget.sprints[0].name = 'de';
        budget.sprints[0].name = 'dev';
        undoRedo.stopEditing();

        undoRedo.undo();
        expect(budget.sprints[0].name).toEqual('homolog');
    });

});
