import React from 'react';
import ReactDOM from 'react-dom';
import Editor, {Grid} from 'src/editor/editor';

import expect from 'expect';
import {mount} from 'enzyme';

describe('GridEditor', () => {
    it('renders without crashing', () => {
        const TestEditor = (props) =>
            <Editor value={{}}>
                <Grid
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
                <Grid
                    rows={value => value.sprints}
                    columns={[NameColumn]}/>
            </Editor>;

        const editor = mount(TestEditor);
        expect(editor.find('span').text()).toEqual('dev');
    });
});
