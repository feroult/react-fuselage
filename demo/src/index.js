import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import { Login } from '../../src/components/login/Login';

import './firebase-config';

import BudgetEditor from './BudgetEditor';
import { parseMessages, Fuselage, Page } from '../../src/index';
import { SessionStore } from "../../src/stores/firebase-session-store";

import messages_en from "./i18n/en.json";

const messages = {
    'en': parseMessages(messages_en)
};

const language = 'en';

class Main extends Component {

    render() {
        const stores = {
            session: new SessionStore()
        };

        return (
            <Fuselage locale={{ language }} messages={messages[language]} stores={stores}>
                <Page path="/" exact component={Login} />
                <Page path="/budgets" authed exact component={BudgetEditor} />
            </Fuselage>
        );
    }
}

ReactDOM.render(<Main />, document.querySelector('#demo'));
