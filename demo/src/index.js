import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';

import BudgetEditor from './BudgetEditor';


class Main extends Component {

    render() {
        return (
            <div>
                <BudgetEditor/>
            </div>
        );
    }
}

ReactDOM.render(<Main/>, document.querySelector('#demo'));
