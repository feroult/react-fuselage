import React, { Component } from 'react';

import * as ui from 'semantic-ui-react';

import './index.css';

import { connect, Editor } from "../../src/index";
import { observer } from 'mobx-react';

const SprintNameCell = observer((props) => {
    const { value: sprint, error } = props;
    return (
        <ui.Input
            value={sprint.name}
            onChange={e => sprint.name = e.target.value}
            fluid
            error={error('sprint.name')}
        />
    );
});

const SprintQuantityCell = observer((props) => {
    const { value: sprint, error } = props;
    return (
        <ui.Input
            value={sprint.quantity}
            onChange={e => sprint.quantity = parseInt(e.target.value) || e.target.value}
            fluid
            error={error('sprint.quantity')}
        />
    );
});

const SprintsEditor = () => {
    const rows = budget => budget.sprints;
    const newRecord = () => ({ name: '', quantity: '' });
    const validate = (sprint, { notEmpty, isInteger }) => {
        notEmpty('sprint.name', sprint.name);
        notEmpty('sprint.quantity', sprint.quantity);
        isInteger('sprint.quantity', sprint.quantity);
    };
    return (
        <Editor.Grid rows={rows} newRecord={newRecord} validate={validate}>
            <SprintNameCell id="sprint.name" width={2} />
            <SprintQuantityCell id="sprint.quantity" width={1} />
        </Editor.Grid>
    )
};

class BudgetEditor extends Component {

    get budget() {
        return this.editor.value;
    }

    get changes() {
        return this.editor.diff('sprints');
    }

    validate() {
        this.editor.validate();
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

    show() {
        console.log('budget', this.editor.changes);
    }

    validate() {
        this.editor.validate();
    }

    render() {
        const budget = {
            name: 'budget 1',
            sprints: [{ name: 'sprint 0', quantity: 1 }, { name: 'dev', quantity: 10 }]
        };

        return (
            <div>
                <BudgetEditor budget={budget} ref={(c) => this.editor = c} />
                <br />
                <ui.ButtonGroup basic>
                    <ui.Button onClick={() => this.show()}>Show</ui.Button>
                    <ui.Button onClick={() => this.validate()}>Validate</ui.Button>
                </ui.ButtonGroup>
            </div>
        );
    }
});

export default Main;