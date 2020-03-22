import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { inject, observer, Provider } from 'mobx-react'
import { injectIntl, IntlProvider } from 'react-intl';

import { formatCurrency, formatPercent } from './locale'

const connect = function () {
    var args = Array.prototype.slice.call(arguments);
    let Comp = args.pop();
    return inject.apply(this, args)(injectIntl(injectHelpers(observer(Comp))));
};

function injectHelpers(WrappedComponent) {

    class HelpersInjector extends Component {
        static contextTypes = {
            router: PropTypes.object
        };

        constructor(props, context) {
            super(props, context);

            // TODO: think about a better helper model?
            this.helpers = {
                formatCurrency: (value, options) => formatCurrency(this.props.intl.formatNumber, value, options),
                formatPercent: (value, options) => formatPercent(this.props.intl.formatNumber, value, options),
                nav: ({ path, global, event }) => {
                    if (event && event.type === 'mousedown' && event.button === 2) {
                        return;
                    }
                    if (event && !event.defaultPrevented) {
                        event.preventDefault();
                    }
                    if (!global) {
                        const session = this.props.sessionStore;
                        path = '/' + session.currentOrgName + path;
                    }
                    if (event && (event.metaKey || event.button === 1)) {
                        // TODO: handle middle button
                        window.open(path, '_blank');
                    }
                    else {
                        this.context.router.history.push(path);
                    }
                }
            }
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    helpers={this.helpers}
                />
            );
        }
    }

    return HelpersInjector;
}

class Middleware extends Component {

    constructor(props) {
        super();
        this.stores = props.stores;
        this.locale = props.locale;
        this.language = props.locale.language;
        this.messages = props.messages;
    }

    getChildContext() {
        return {
            locale: this.locale
        };
    }

    render() {
        return (
            <Provider {...this.stores}>
                <IntlProvider locale={this.language} messages={this.messages}>
                    {this.props.children}
                </IntlProvider>
            </Provider>
        );
    }

}

Middleware.childContextTypes = {
    locale: PropTypes.object
};

export default Middleware;

export { connect };

