import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as mobx from 'mobx';
import Handler from './handler/handler';
import Grid from './Grid';
import {Tab, TabGroup} from './Tab';
import RenderUtil from '../util/render-util';

class Editor extends Component {

    static childContextTypes = {
        handler: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.handler = new Handler(props.value);
        this._initChildren();
    }

    get value() {
        return mobx.toJS(this.handler.value);
    }

    _initChildren() {
        let children = RenderUtil.splitChildren(this.props.children, {tabs: Tab});
        this.children = children.other;
        if ('tabs' in children) {
            this.children.push(<TabGroup key="tab-group" state={this.handler.state} tabs={children.tabs}/>);
        }
    }

    getChildContext() {
        return {handler: this.handler};
    }

    render() {
        return (
            <section onFocus={this.handler.onFocus} onBlur={this.handler.onBlur}>
                {this.children}
            </section>
        );
    }

}

Object.assign(Editor, {Grid, Tab});
export default Editor;
export {Grid, Tab};
