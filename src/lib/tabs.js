import React, {Component} from 'react';

const Tab = (props) => {
    return props.children;
};

const TabGroupNav = ({tabs, ...props}) => {
    return (
        <section className="reb-tab-group-nav">
            <ul>
                {tabs.map((tab, index) => {
                    return <li key={"tab-group-nav-" + index}>{tab.props.title}</li>;
                })}
            </ul>
        </section>
    );
};

class TabGroup extends Component {

    state = {
        currentTab: 0
    };

    render() {
        return (
            <section>
                <TabGroupNav
                    currentTab={this.state.currentTab}
                    tabs={this.props.tabs}/>
                {this.props.tabs}
            </section>
        );
    }


}

export {Tab, TabGroup};