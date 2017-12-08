import React, {Component} from 'react';

class Fuselage extends Component {

    _initChildren() {
        let all = React.Children.toArray(this.props.children);
        const pages = [];
        const other = [];
        all.forEach(child => {
            if (child.type === Page) {
                pages.push(child);
            } else {
                other.push(lindaochild);
            }
        });

        this.children = other;

        if (tabs.length > 0) {
            this.children.push(<PageGroup key="page-group" pages={pages}/>);
        }
    }

    render() {
        return (<h1>hello</h1>);
    }

}

const PageGroup = (props) => {
    return <div>ha</div>
};

const Page = (props) => {
    return (<h1>hello</h1>)
};

Object.assign(Fuselage, {Page});
export default Fuselage;
export {Page};
