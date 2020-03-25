import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as mobx from 'mobx';
import Handler from './handler/handler';
import Grid from './Grid';
import { Tab, TabGroup } from './Tab';
import RenderUtil from '../../utils/render-util';

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
        let children = RenderUtil.splitChildren(this.props.children, { tabs: Tab });
        this.children = children.other;
        if ('tabs' in children) {
            this.children.push(
                <TabGroup key="tab-group" state={this.handler.state}>
                    {children.tabs}
                </TabGroup>
            );
        }
    }

    getChildContext() {
        return { handler: this.handler };
    }

    render() {
        return (
            <section onFocus={this.handler.onFocus} onBlur={this.handler.onBlur}>
                {this.children}
            </section>
        );
    }

}

const diffArrays = (arr1, arr2, idField) => {
    const inserted = [];
    const updated = [];
    const deleted = [];

    const keys1 = {};
    const keys2 = {};

    arr1.forEach(item => keys1[item[idField]] = item);
    arr2.forEach(item => keys2[item[idField]] = item);

    arr1.forEach(item => {
        const other = keys2[item[idField]]
        if (!other) {
            deleted.push(item);
        } else {
            if (other.username !== item.username || other.location !== item.location) {
                updated.push(item);
            }
        }
    });

    arr2.forEach(item => {
        if (!keys1[item[idField]]) {
            inserted.push(item);
        }
    });

    return { inserted, updated, deleted }
}


Object.assign(Editor, { Grid, Tab });
export { Editor, Grid, Tab };
