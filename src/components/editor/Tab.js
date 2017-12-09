import React from 'react';
import {Tab as SemanticTab} from 'semantic-ui-react'
import {observer} from 'mobx-react'

const Tab = (props) => {
    return props.children;
};

const TabGroup = observer(({state, children: tabs}) => {
    const panes = tabs.map((tab, index) => ({
        menuItem: tab.props.title,
        render: () => <SemanticTab.Pane>{tabs[index]}</SemanticTab.Pane>
    }));

    const onTabChange = (event, data) => state.tab = data.activeIndex;

    return (
        <section>
            <SemanticTab
                menu={{borderless: true, attached: true, tabular: true}}
                activeIndex={state.tab}
                onTabChange={onTabChange}
                panes={panes}/>
        </section>
    );
});


export {Tab, TabGroup};