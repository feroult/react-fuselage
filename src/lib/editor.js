import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Handler from './handler/handler';
import GridEditor from './grid-editor';
import Tab from './tab';

class Editor extends Component {

    static childContextTypes = {
        handler: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.handler = new Handler(props.value);

        // this.props.children.forEach(e => {
        //     console.log('e', e);
        // });
    }

    getChildContext() {
        return {handler: this.handler};
    }

    render() {
        return (
            <section onFocus={this.handler.onFocus} onBlur={this.handler.onBlur}>
                {this.props.children}
            </section>
        );
    }

}

export default Editor;
export {GridEditor, Tab};