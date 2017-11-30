import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Handler} from './handler';
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
        return this.props.children;
    }

}

export {Editor, GridEditor};