import {Component} from 'react';
import PropTypes from 'prop-types';
import {GridEditor} from './grid-editor';
import * as mobx from 'mobx';

class Editor extends Component {

    constructor(props) {
        super(props);
        this.observe(props.value);
        this.handler = new EditorHandler(props.value);
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

class EditorHandler {
    constructor(value) {
        this.value = value;
    }
}


export {Editor, GridEditor};