import React from 'react';
import { Tab as SemanticTab } from 'semantic-ui-react'

import { connect } from '../../utils/middleware'

const Tab = (props) => {
    return props.children;
};

const TabGroup = connect(({ state, children: tabs, intl }) => {

    const panes = tabs.map((tab, index) => ({
        menuItem: intl.formatMessage({ id: tab.props.title }),
        render: () => <SemanticTab.Pane>{tabs[index]}</SemanticTab.Pane>
    }));

    const onTabChange = (event, data) => state.tab = data.activeIndex;

    return (
        <section>
            <SemanticTab
                menu={{ borderless: true, attached: true, tabular: true }}
                activeIndex={state.tab}
                onTabChange={onTabChange}
                panes={panes} />
        </section>
    );
});


export { Tab, TabGroup };