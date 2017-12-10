import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import Login from '../../src/components/login/Login';

import BudgetEditor from './BudgetEditor';
import Fuselage, {Page} from '../../src/components/fuselage/Fuselage';

class Main extends Component {

    render() {
        return (
            <Fuselage>
                <Page path="/" exact component={Login}/>
                <Page path="/budgets" authed exact component={BudgetEditor}/>
            </Fuselage>
        );
    }
}

ReactDOM.render(<Main/>, document.querySelector('#demo'));
