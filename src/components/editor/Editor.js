import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as mobx from 'mobx';
import Handler from './handler/handler';
import Grid from './Grid';
import { Tab, TabGroup } from './Tab';
import RenderUtil from '../../utils/render-util';

const ARRAY_ID_CONTROL = '__fuse_id';

class Editor extends Component {

    static childContextTypes = {
        handler: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.backup = controlArrays(props.value);
        this.handler = new Handler(this.backup);
        this._initChildren();
    }

    get value() {
        return releaseArrays(mobx.toJS(this.handler.value));
    }

    diff(arrayId) {
        return diffArrays(this.backup[arrayId], mobx.toJS(this.handler.value)[arrayId], ARRAY_ID_CONTROL);
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

const controlArrays = (obj) => {
    const object = Object.assign({}, obj);
    const values = Object.values(object)
    for (const value of values) {
        if (Array.isArray(value)) {
            value.forEach((el, i) => el[ARRAY_ID_CONTROL] = i);
        }
    }
    return object;
}

const releaseArrays = (obj) => {
    const object = Object.assign({}, obj);
    const values = Object.values(object)
    for (const value of values) {
        if (Array.isArray(value)) {
            value.forEach(el => delete el[ARRAY_ID_CONTROL]);
        }
    }
    return object;
}

const diffArrays = (arr1, arr2, idField) => {
    const inserted = [];
    const updated = [];
    const deleted = [];

    const keys1 = {};
    const keys2 = {};

    arr1.forEach(item => keys1[item[idField]] = Object.assign({}, item));
    arr2.forEach(item => keys2[item[idField]] = Object.assign({}, item));

    arr1.forEach(item => {
        const other = keys2[item[idField]]
        if (!other) {
            deleted.push(item);
        } else {
            const obj1 = Object.assign({}, item);
            delete obj1[idField];
            const obj2 = Object.assign({}, other);
            delete obj2[idField];
            if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
                updated.push(other);
            }
        }
    });

    arr2.forEach(item => {
        if (!keys1[item[idField]]) {
            inserted.push(item);
        }
    });

    return releaseArrays({ inserted, updated, deleted });
}


Object.assign(Editor, { Grid, Tab });
export { Editor, Grid, Tab };
