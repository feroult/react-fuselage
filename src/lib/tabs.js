import React, {Component} from 'react';

const Tab = (props) => {
    return props.children;
};

const TabGroupNav = ({tabs, ...props}) => {
    return (
        <section className="reb-tab-group-nav">
            <ul>
                {tabs.map((tab, index) => {
                    return (
                        <li key={"tab-group-nav-" + index}>
                            <a onClick={() => props.changeTab(index)}>
                                {tab.props.title}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

class TabGroup extends Component {

    state = {
        currentTab: 0
    };

    changeTab = (currentTab) => {
        this.setState({currentTab})
    };

    render() {
        return (
            <section>
                <TabGroupNav
                    currentTab={this.state.currentTab}
                    changeTab={this.changeTab}
                    tabs={this.props.tabs}/>
                {this.props.tabs[this.state.currentTab]}
            </section>
        );
    }


}

export {Tab, TabGroup};