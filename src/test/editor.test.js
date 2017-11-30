import React from 'react';
import ReactDOM from 'react-dom';
import Editor from '../lib/editor';

import './helper';
import {shallow} from 'enzyme';
import {expect} from 'chai';

describe('Editor', () => {
    it('renders without crashing', () => {
        const TestEditor = (props) =>
            <Editor value={{}}>
                <div>hello</div>
            </Editor>;

        const div = document.createElement('div');
        ReactDOM.render(<TestEditor/>, div);
    });

    it('contains inner children', () => {
        const TestEditor = (props) =>
            <Editor value={{}}>
                <div>hello</div>
            </Editor>;

        const editor = shallow(<TestEditor/>);
        expect(editor.find('div').length).to.be.equal(1);
    });
});
