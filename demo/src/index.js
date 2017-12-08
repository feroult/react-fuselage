import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';

import BudgetEditor from './BudgetEditor';
import Fuselage from '../../src/fuselage/Fuselage';

const Home = (props) => <h1>Hello</h1>;

class Main extends Component {

    render() {
        return (
            <Fusalage>
                <Fuselage.Page pattern="/" exact component={Home}/>
                <Fuselage.Page authed pattern="/budgets" exact component={BudgetEditor}/>
            </Fusalage>
        );
    }
}

ReactDOM.render(<Main/>, document.querySelector('#demo'));
