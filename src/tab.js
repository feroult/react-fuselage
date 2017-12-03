import React from 'react';
import {observer} from 'mobx-react'


const Tab = (props) => {
    return props.children;
};

const TabGroupNav = ({state, tabs, ...props}) => {

    const changeTab = (index) => state.tab = index;

    return (
        <section className="reb-tab-group-nav">
            <ul>
                {tabs.map((tab, index) => {
                    return (
                        <li key={"tab-group-nav-" + index}>
                            <a onClick={() => changeTab(index)}>
                                {tab.props.title}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

const TabGroup = observer(({state, tabs, ...props}) => {
    return (
        <section>
            <TabGroupNav state={state} tabs={tabs}/>
            {tabs[state.tab]}
        </section>
    );
});


export {Tab, TabGroup};