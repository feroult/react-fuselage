import React, {Component} from 'react';
import * as mobx from 'mobx';
import {Editor, GridEditor} from '../lib/index.js';

const NameColumn = (props) => {
    const {value: sprint} = props;
    return (
        <input
            value={sprint.name}
            onChange={e => sprint.name = e.target.value}
        />
    );
};

const QuantityColumn = (props) => {
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
    const columns = [NameColumn, QuantityColumn];
    const newRecord = () => ({name: '', quantity: ''});
    return <GridEditor
        newRecord={newRecord}
        rows={rows}
        columns={columns}
    />;
};

class BudgetEditor extends Component {
    render() {
        const budget = this.props.budget;
        return (
            <Editor value={budget}>
                <SprintsEditor/>
            </Editor>
        );
    }
}

export default class Main extends Component {

    print(budget) {
        console.log('budget', mobx.toJS(budget));
    }

    render() {
        const budget = {
            name: 'budget 1',
            sprints: [{name: 'sprint 0', quantity: 1}, {name: 'dev', quantity: 10}]
        };

        return (
            <div>
                <BudgetEditor budget={budget}/>
                <button onClick={() => this.print(budget)}>print</button>
            </div>
        );
    }
}
