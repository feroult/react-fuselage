import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, GridEditor} from '../lib/editor';

import './helper';
import {mount} from 'enzyme';
import {expect} from 'chai';

describe('GridEditor', () => {
    it('renders without crashing', () => {
        const TestEditor = (props) =>
            <Editor value={{}}>
                <GridEditor
                    rows={() => []}
                    columns={[]}/>
            </Editor>;

        const div = document.createElement('div');
        ReactDOM.render(<TestEditor/>, div);
    });

    it('renders rows and columns', () => {
        const NameColumn = (props) => {
            return <span>{props.value.name}</span>;
        };

        const value = {list: [{name: 'jane'}]};

        const TestEditor =
            <Editor value={value}>
                <GridEditor
                    rows={value => value.list}
                    columns={[NameColumn]}/>
            </Editor>;

        const editor = mount(TestEditor);
        expect(editor.find('span').text()).to.be.equal('jane');
    });
});
