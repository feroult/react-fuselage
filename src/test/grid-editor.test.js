import React from 'react';
import ReactDOM from 'react-dom';
import Editor, {GridEditor} from '../lib/editor';

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
        const NameColumn = ({value: sprint, ...props}) => {
            return <span>{sprint.name}</span>;
        };

        const value = {sprints: [{name: 'dev'}]};

        const TestEditor =
            <Editor value={value}>
                <GridEditor
                    rows={value => value.sprints}
                    columns={[NameColumn]}/>
            </Editor>;

        const editor = mount(TestEditor);
        expect(editor.find('span').text()).to.be.equal('dev');
    });
});
