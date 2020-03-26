import React, { Component } from 'react';

import * as ui from 'semantic-ui-react';

import './index.css';

import { connect, Editor } from "../../src/index";

const SprintNameCell = (props) => {
    const { value: sprint } = props;
    return (
        <ui.Input
            value={sprint.name}
            onChange={e => sprint.name = e.target.value}
            fluid
        />
    );
};

const SprintQuantityCell = (props) => {
    const { value: sprint } = props;
    return (
        <ui.Input
            value={sprint.quantity}
            onChange={e => sprint.quantity = e.target.value}
            fluid
        />
    );
};

const SprintsEditor = () => {
    const rows = budget => budget.sprints;
    const cols = [
        { cell: SprintNameCell, key: 'sprint.name', width: 2 },
        { cell: SprintQuantityCell, key: 'sprint.quantity', width: 1 }
    ];
    const createRecord = () => ({ name: '', quantity: '' });
    const validateRecord = (sprint) => {
        return false;
    };
    return <Editor.Grid
        createRecord={createRecord}
        validateRecord={validateRecord}
        enableRemove
        rows={rows}
        cols={cols}
    />;
};

class BudgetEditor extends Component {

    get budget() {
        return this.editor.value;
    }

    get changes() {
        return this.editor.diff('sprints')
    }

    render() {
        const budget = this.props.budget;
        return (
            <Editor value={budget} ref={c => this.editor = c}>
                <Editor.Tab title="tab1">
                    <SprintsEditor />
                </Editor.Tab>
                <Editor.Tab title="tab2">
                    <SprintsEditor />
                </Editor.Tab>
            </Editor>
        );
    }
}

const Main = connect(class extends Component {

    show(budget) {
        console.log('budget', this.editor.changes);
    }

    render() {
        const budget = {
            name: 'budget 1',
            sprints: [{ name: 'sprint 0', quantity: 1 }, { name: 'dev', quantity: 10 }]
        };

        return (
            <div>
                <BudgetEditor budget={budget} ref={(c) => this.editor = c} />
                <ui.Divider />
                <ui.Button onClick={() => this.show()}>Show</ui.Button>
            </div>
        );
    }
});

export default Main;