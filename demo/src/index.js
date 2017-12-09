import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';

import BudgetEditor from './BudgetEditor';
import Fuselage, {Page} from '../../src/fuselage/Fuselage';

const Home = (props) => <h1>Hello</h1>;

class Main extends Component {

    render() {
        return (
            <Fuselage>
                <Page path="/" exact component={Home}/>
                <Page authed path="/budgets" exact component={BudgetEditor}/>
            </Fuselage>
        );
    }
}

ReactDOM.render(<Main/>, document.querySelector('#demo'));
