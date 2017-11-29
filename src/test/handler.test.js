import React from 'react';
import {Handler} from '../lib/handler';

import './helper';
import {expect} from 'chai';

describe('Handler', () => {
    it('can undo changes', () => {
        const handler = new Handler({sprints: [{name: 'dev'}]});
        expect(handler.value.sprints[0].name).to.be.equals('dev');

        handler.value.sprints[0].name = 'homolog';
        expect(handler.value.sprints[0].name).to.be.equals('homolog');

        handler.undoHandler.popUndo();
        expect(handler.value.sprints[0].name).to.be.equals('dev');
    });
});
