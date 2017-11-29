import {Component} from 'react';
import PropTypes from 'prop-types';
import {Handler} from './handler';
import {GridEditor} from './grid-editor';
import * as mobx from 'mobx';

class Editor extends Component {

    constructor(props) {
        super(props);
        this.observe(props.value);
        this.handler = new Handler(props.value);
    }

    observe(value) {
        if (!mobx.isObservable(value)) {
            mobx.extendObservable(value, value);
        }
    }

    getChildContext() {
        return {handler: this.handler};
    }

    render() {
        return this.props.children;
    }

}

Editor.childContextTypes = {
    handler: PropTypes.object
};

export {Editor, GridEditor};