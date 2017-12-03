import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';

import Editor, {Tab} from "../../src/editor";

const SprintNameCell = (props) => {
    const {value: sprint} = props;
    return (
        <input
            value={sprint.name}
            onChange={e => sprint.name = e.target.value}
        />
    );
};

const SprintQuantityCell = (props) => {
    const {value: sprint} = props;
    return (
        <input
            value={sprint.quantity}
            onChange={e => sprint.quantity = e.target.value}
        />
    );
};

const SprintsEditor = (props) => {
    const rows = budget => budget.sprints;
    const columns = [SprintNameCell, SprintQuantityCell];
    const newRecord = () => ({name: '', quantity: ''});
    return <Editor.Grid
        newRecord={newRecord}
        rows={rows}
        columns={columns}
    />;
};

const TeamNameCell = (props) => {
    const {value: team} = props;
    return (
        <input
            value={team.name}
            onChange={e => team.name = e.target.value}
        />
    );
};

const TeamEditor = (props) => {
    const rows = budget => budget.team;
    const columns = [TeamNameCell];
    const newRecord = () => ({name: ''});
    return <Editor.Grid
        newRecord={newRecord}
        rows={rows}
        columns={columns}
    />;
};

class BudgetEditor extends Component {

    get budget() {
        return this.editor.value;
    }

    render() {
        const budget = this.props.budget;
        return (
            <Editor value={budget} ref={c => this.editor = c}>
                <Tab title="Sprints">
                    <SprintsEditor/>
                </Tab>
                <Tab title="Team">
                    <TeamEditor/>
                </Tab>
            </Editor>
        );
    }
}

class Main extends Component {

    print(budget) {
        console.log('budget', this.editor.budget);
    }

    render() {
        const budget = {
            name: 'budget 1',
            sprints: [{name: 'sprint 0', quantity: 1}, {name: 'dev', quantity: 10}],
            team: [{name: 'dev sr'}]
        };

        return (
            <div>
                <BudgetEditor budget={budget} ref={(c) => this.editor = c}/>
                <button onClick={() => this.print(budget)}>print</button>
            </div>
        );
    }
}

ReactDOM.render(<Main/>, document.querySelector('#demo'));
