import React from 'react';
import ReactDOM from 'react-dom';
import {Editor} from '../lib/editor';

const TestEditor = (props) => {
    return (
        <Editor value={{}}>
            <div>hello</div>
        </Editor>
    );
};

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TestEditor/>, div);
});
