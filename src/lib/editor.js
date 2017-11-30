import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Handler} from './handler/handler';
import {GridEditor} from './grid-editor';

class Editor extends Component {

    static childContextTypes = {
        handler: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.handler = new Handler(props.value);
    }

    getChildContext() {
        return {handler: this.handler};
    }

    render() {
        return (
            <section onFocus={this.handler.onFocus} onBlur={this.handler.onBlur}>
                {this.props.children}
            </section>
        );
    }

}

export {Editor, GridEditor};