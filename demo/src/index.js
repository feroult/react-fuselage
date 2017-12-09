import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';

import BudgetEditor from './BudgetEditor';
import Fuselage, {Page} from '../../src/components/fuselage/Fuselage';

const Home = (props) => <h1>Hello</h1>;

class Main extends Component {

    render() {
        return (
            <Fuselage>
                <Page path="/" exact component={Home}/>
                <Page path="/budgets" authed exact component={BudgetEditor}/>
            </Fuselage>
        );
    }
}

ReactDOM.render(<Main/>, document.querySelector('#demo'));
