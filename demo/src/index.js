import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import { Login } from '../../src/components/login/Login';

import './firebase-config';

import BudgetEditor from './BudgetEditor';
import { Fuselage, Page } from '../../src/components/fuselage/Fuselage';
// TODO: fixme
import SessionStore from "../../src/stores/firebase-session-store";

class Main extends Component {

    render() {
        const stores = {
            session: new SessionStore()
        };

        return (
            <Fuselage locale={{}} stores={stores}>
                <Page path="/" exact component={Login} />
                <Page path="/budgets" authed exact component={BudgetEditor} />
            </Fuselage>
        );
    }
}

ReactDOM.render(<Main />, document.querySelector('#demo'));
