import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Middleware from "../../utils/middleware";
import RenderUtil from '../../utils/render-util';

class Fuselage extends Component {
    constructor(props) {
        super(props);
        this._initChildren();
    }

    _initChildren() {
        let children = RenderUtil.splitChildren(this.props.children, { pages: Page });
        this.children = children.other;
        if ('pages' in children) {
            this.children.push(
                <PageGroup key="page-group">
                    {children.pages}
                </PageGroup>
            );
        }
    }

    render() {
        const stores = this.props.stores;
        const locale = this.props.locale;
        const messages = this.props.messages;

        return (
            <BrowserRouter>
                <Route component={
                    (route) =>
                        <Middleware stores={stores} locale={locale} messages={messages} location={route.location}>
                            <section>
                                {this.children}
                            </section>
                        </Middleware>
                } />
            </BrowserRouter>
        );
    }

}

const PageGroup = ({ children: pages }) => {
    return pages;
};

const Page = (props) => {
    return (
        <Route
            {...props}
            component={props.component}
        />);

};

Object.assign(Fuselage, { Page });
export { Fuselage, Page };
