import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Handler} from './handler';
import {GridEditor} from './grid-editor';
import * as mobx from 'mobx';

class Editor extends Component {

    static childContextTypes = {
        handler: PropTypes.object
    };

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
        return <section
            onKeyDown={this.handler.handleShortcuts}>
            {this.props.children}
        </section>
    }

}

export {Editor, GridEditor};