import React from 'react';
import {Handler} from '../lib/handler';

import './helper';
import {expect} from 'chai';

describe('Handler', () => {
    it('can undo deep object changes', () => {
        const handler = new Handler({sprints: [{info: {name: 'dev'}}]});

        let budget = handler.value;
        expect(budget.sprints[0].info.name).to.be.equals('dev');

        budget.sprints[0].info.name = 'homolog 1';
        expect(budget.sprints[0].info.name).to.be.equals('homolog 1');

        budget.sprints[0].info.name = 'homolog 2';
        expect(budget.sprints[0].info.name).to.be.equals('homolog 2');

        handler.undoHandler.popUndo();
        expect(budget.sprints[0].info.name).to.be.equals('homolog 1');

        handler.undoHandler.popUndo();
        expect(budget.sprints[0].info.name).to.be.equals('dev');
    });
});
