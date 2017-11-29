import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, GridEditor} from '../lib/editor';

import './helper';
import {mount} from 'enzyme';
import {expect} from 'chai';

describe('GridEditor', () => {

    xit('renders rows and columns', () => {
        const NameColumn = (props) => {
            const {value: sprint} = props;
            return (
                <input
                    value={sprint.name}
                    onChange={e => sprint.name = e.target.value}
                />
            );
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
