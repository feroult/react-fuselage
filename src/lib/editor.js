import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Handler from './handler/handler';
import Grid from './grid';
import Tab from './tab';

class Editor extends Component {

    static childContextTypes = {
        handler: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.handler = new Handler(props.value);
        this.initChildren();
    }

    initChildren() {
        this.x = React.Children.toArray(this.props.children);
        // this.props.children.forEach(e => {
        //     console.log('e', e);
        // });
    }

    getChildContext() {
        return {handler: this.handler};
    }

    render() {
        return (
            <section onFocus={this.handler.onFocus} onBlur={this.handler.onBlur}>
                {this.x}
            </section>
        );
    }

}

Object.assign(Editor, {Grid, Tab});

export default Editor;
export {Grid, Tab};
