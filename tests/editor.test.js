import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';

import expect from 'expect';

import Editor from "../src/editor";

describe('Editor', () => {
    let node;

    beforeEach(() => {
        node = document.createElement('div');
    });

    afterEach(() => {
        unmountComponentAtNode(node)
    });

    it('contains inner children', () => {
        const TestEditor = (props) =>
            <Editor value={{}}>
                <div>hello</div>
            </Editor>;

        render(<TestEditor/>, node, () => {
            expect(node.innerHTML).toContain('<div>');
        });

    });

});
