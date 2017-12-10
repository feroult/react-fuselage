import React, {Component} from "react";
import {connect} from "./middleware";
import {toNumber} from "./locale";

const InputFormatter = connect(class extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editing: false
        };
        this.inputProps = this.configureInputProps();
    }

    configureInputProps = ()=> {
        var props = Object.assign({}, this.props);
        delete props.value;
        delete props.onChange;
        delete props.intl;
        delete props.helpers;
        delete props.format;
        return props;
    };

    editing = (flag) => {
        this.setState({editing: flag});
    };

    onBlur = (e) => {
        this.editing(false);
        let value = toNumber(this.props.value);
        if (isNaN(value)) {
            value = 0;
        }
        this.props.onChange({target: {value: value}});
    };

    onFocus = (e) => {
        this.editing(true);
        this.select = true;
    };

    componentDidUpdate() {
        if (this.select) {
            this.select = false;
            this.input.select();
        }
    }

    onChange = (e) => {
        const value = e.target.value;
        this.props.onChange({target: {value: value}});
    };

    formatValue = () => {
        const {formatNumber} = this.props.intl;

        const value = this.props.value;
        if (this.state.editing) {
            return value === 0 ? '' :
                (typeof value === 'number' ? formatNumber(value, {
                    maximumFractionDigits: 20,
                    useGrouping: false
                }) : value);
        }
        if (!value || value === 0) {
            return '';
        }
        return this.props.format(value);
    };

    render() {
        const value = this.formatValue();

        return (
            <input
                {...this.inputProps }
                value={value}
                ref={input => this.input = input}
                onChange={this.onChange}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
            />
        );
    }

});

const PercentInput = connect((props) => {
    const {formatPercent} = props.helpers;

    const format = (value) => formatPercent(value);

    return (
        <InputFormatter
            {...props}
            format={format}
        />
    );
});

const CurrencyInput = connect((props) => {
    const {formatCurrency} = props.helpers;

    const format = (value) => formatCurrency(value);

    return (
        <InputFormatter
            {...props}
            format={format}
        />
    );
});

const NumberInput = connect((props) => {
    const {formatNumber} = props.intl;

    const format = (value) => formatNumber(value, {maximumFractionDigits: 2});

    return (
        <InputFormatter
            {...props}
            format={format}
        />
    );
});

export {
    CurrencyInput,
    PercentInput,
    NumberInput,
}