import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import * as mobx from 'mobx';
import { observer } from 'mobx-react'
import Dragula from 'react-dragula';
import * as ui from 'semantic-ui-react'

import { FormattedMessage } from 'react-intl';

import './Grid.css';

const cellWrapper = (Input) => {
    const WrappedInput = Input.name === 'Injector' ? Input : observer(Input);
    return (props) => {
        const className = gridClassName(props.grid);
        return (
            <div className={className}
                onKeyDown={(e) => handleNavigation(e, className, props.grid)}>
                <WrappedInput {...props} />
            </div>
        );
    };
};

const GridContent = class extends Component {
    render() {
        const props = this.props;
        return (
            <section>
                <ui.Button color="green" icon="add" onClick={props.addRecord} />
                <ui.Grid>
                    {props.children}
                </ui.Grid>
            </section>
        );
    }
};

const Grid = observer(class extends Component {

    static contextTypes = {
        handler: PropTypes.object
    };

    rowCount = this.props.rows.length;

    get _rows() {
        return this.props.rows(this.context.handler.value);
    }

    get _headers() {
        return this.props.headers;
    }

    componentDidUpdate(prevProps, prevState) {
        const rowCount = this._rows.length;

        if (rowCount > this.rowCount) {
            focusInput({
                row: rowCount - 1,
                column: 0
            });
        }
        if (rowCount !== this.rowCount) {
            this.rowCount = rowCount;
        }
    }

    render() {
        const {
            newRecord = () => ({}),
            addRecord = () => this._rows.push(newRecord()),
            moveRecord = (fromIndex, toIndex) => {
                mobx.runInAction(() => {
                    if (toIndex >= this._rows.length) {
                        toIndex = this._rows.length - 1;
                    }
                    this._rows.splice(toIndex, 0, this._rows.splice(fromIndex, 1)[0]);
                });
            }
        } = this.props;

        return (
            <GridContent addRecord={addRecord} ref={(component) => dragAndDropDecorator(component, moveRecord)}>
                {this.renderHeader()}
                {this.renderRows()}
            </GridContent>
        );
    }

    renderHeader = () => {
        return <div className="reb-grid-row">
            {this._headers.map((header, i) =>
                <div className="reb-grid-cell" key={i}>
                    <FormattedMessage id={header} />
                </div>
            )}
        </div>
    }

    renderRows = () => {
        const {
            columns,
            removeRecord = (index) => this._rows.splice(index, 1)
        } = this.props;

        return this._rows.map((value, i) => {
            return (
                <ui.Grid.Row key={i}>
                    {columns.map((Input, j) => {
                        const grid = {
                            rows: this._rows.length, columns: columns.length,
                            row: i, column: j
                        };
                        const Cell = cellWrapper(Input);
                        return (
                            <ui.Grid.Column key={i + '-' + j} width={2}>
                                <Cell grid={grid} value={value} />
                            </ui.Grid.Column>
                        );
                    })}
                    <ui.Grid.Column key={i + '-' + columns.length} width={1}>
                        <ui.Button.Group basic>
                            <ui.Button icon="trash" color="green" onClick={() => removeRecord(i)} />
                            <ui.Button icon="move" />
                        </ui.Button.Group>
                    </ui.Grid.Column>

                </ui.Grid.Row>
            )
        });
    }
});

// UI Behavior

const gridClassName = (grid) => `__grid-row${grid.row}-column${grid.column}__`;

const dragAndDropDecorator = (component, moveFn) => {
    if (!component) {
        return;
    }

    const grid = ReactDOM.findDOMNode(component).querySelector('.ui.grid');

    if (grid.getAttribute('data-reb-grid') === 'on') {
        return;
    } else {
        grid.setAttribute('data-reb-grid', 'on')
    }

    const drake = Dragula([grid], {
        mirrorContainer: grid
    });

    let fromIndex;
    drake.on('drag', (el, target, source, sibling) => {
        console.log('parent', el.parentElement);
        fromIndex = Array.from(el.parentElement.children).indexOf(el);
    });

    drake.on('drop', (el, target, source, sibling) => {
        const toIndex = Array.from(el.parentElement.children).indexOf(el);
        moveFn(fromIndex, toIndex);
        drake.cancel(true);
    });
};

const handleVerticalNavigation = (event, grid) => {
    event.preventDefault();

    let { row, column } = grid;

    if (event.key === 'ArrowUp') {
        if (row === 0) {
            return;
        }
        row--;
    } else {
        if (row === grid.rows - 1) {
            return;
        }
        row++;
    }

    selectInput({ row, column });
};

const handleHorizontalNavigation = (event, grid) => {
    event.preventDefault();

    let { row, column } = grid;

    if (event.key === 'ArrowLeft') {
        if (column === 0) {
            return;
        }
        column--;
    } else {
        if (column === grid.columns - 1) {
            return;
        }
        column++;
    }

    selectInput({ row, column });
};

const findInput = function (grid) {
    const className = gridClassName(grid);
    return document.getElementsByClassName(className)[0].firstChild.firstChild;
};

const focusInput = (grid) => findInput(grid).focus();

const selectInput = (grid) => {
    const input = findInput(grid);
    if (input.select) {
        input.select();
    }
    input.focus();
};

const handleNavigation = (event, className, grid) => {
    if (event.key === 'Enter' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        handleVerticalNavigation(event, grid);
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        handleHorizontalNavigation(event, grid);
    }
};

export default Grid;