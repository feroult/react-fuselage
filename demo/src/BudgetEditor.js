import React, { Component } from 'react';

import { Input } from 'semantic-ui-react';

import './index.css';

import { connect, Editor, Tab } from "../../src/index";

const SprintNameCell = (props) => {
    const { value: sprint } = props;
    return (
        <Input
            value={sprint.name}
            onChange={e => sprint.name = e.target.value}
            fluid
        />
    );
};

const SprintQuantityCell = (props) => {
    const { value: sprint } = props;
    return (
        <Input
            value={sprint.quantity}
            onChange={e => sprint.quantity = e.target.value}
            fluid
        />
    );
};

const SprintsEditor = (props) => {
    const rows = budget => budget.sprints;
    const columns = [SprintNameCell, SprintQuantityCell];
    const cols = [
        { cell: SprintNameCell, key: 'sprint.name', width: 2 },
        { cell: SprintQuantityCell, key: 'sprint.quantity', width: 1 }
    ];
    const newRecord = () => ({ name: '', quantity: '' });
    return <Editor.Grid
        cols={cols}
        headers={['sprint.name', 'sprint.name']}
        newRecord={newRecord}
        rows={rows}
        columns={columns}
    />;
};

const TeamNameCell = (props) => {
    const { value: team } = props;
    return (
        <input
            value={team.name}
            onChange={e => team.name = e.target.value}
        />
    );
};

class BudgetEditor extends Component {

    get budget() {
        return this.editor.value;
    }

    render() {
        const budget = this.props.budget;
        return (
            <Editor value={budget} ref={c => this.editor = c}>
                <Tab title="tab1">
                    <SprintsEditor />
                </Tab>
                <Tab title="tab2">
                    <SprintsEditor />
                </Tab>
            </Editor>
        );
    }
}

const Main = connect(class extends Component {

    print(budget) {
        console.log('budget', this.editor.budget);
    }

    render() {
        const budget = {
            name: 'budget 1',
            sprints: [{ name: 'sprint 0', quantity: 1 }, { name: 'dev', quantity: 10 }]
        };

        return (
            <div>
                <BudgetEditor budget={budget} ref={(c) => this.editor = c} />
                <button onClick={() => this.print(budget)}>print</button>
            </div>
        );
    }
});

export default Main;