import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import * as mobx from 'mobx';
import { observer } from 'mobx-react'
import Dragula from 'react-dragula';
import * as ui from 'semantic-ui-react'

import { FormattedMessage } from 'react-intl';

import './Grid.css';

const cellWrapper = (cell) => {
    return (props) => {
        const className = gridClassName(props.grid);
        return (
            <div className={className}
                onKeyDown={(e) => handleNavigation(e, className, props.grid)}>
                {
                    React.cloneElement(cell, props)
                }
            </div>
        );
    };
};

const Grid = observer(class extends Component {

    static contextTypes = {
        handler: PropTypes.object
    };

    constructor(props) {
        super(props);
        this._initChildren();
    }

    _initChildren() {
        this._cols = React.Children.map(this.props.children, child => {
            const props = child.props;
            return { cell: child, ...props };
        });
    }

    componentDidMount() {
        const handler = this.context.handler;
        handler
            .validator
            .register(this.props.fuseId, () => this.props.rows(handler.value), this.props.validate);
    }

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
                    this.context.handler.validator.moveGridRecord(this.props.fuseId, fromIndex, toIndex);
                });
            }
        } = this.props;

        return (
            <div>
                <ui.Button color="green" icon="add" basic onClick={addRecord} />
                <ui.Grid className="labels">
                    {this.renderHeader()}
                </ui.Grid>
                <section className="fields" ref={c => dragAndDropDecorator(c, moveRecord)}>
                    <ui.Grid>
                        {this.renderRows()}
                    </ui.Grid>
                </section>
            </div>
        );
    }

    renderHeader = () => {
        return <ui.Grid.Row>
            <div className="drag" />
            {this._cols.map(col =>
                <ui.Grid.Column key={col.id} width={col.width} textAlign="center">
                    <ui.Label size='large' pointing='below'>
                        <FormattedMessage id={col.id} />
                    </ui.Label>
                </ui.Grid.Column>
            )}
        </ui.Grid.Row>
    }

    renderRows = () => {
        const {
            fuseId,
            removeRecord = (index) => this._rows.splice(index, 1)
        } = this.props;

        const { validator } = this.context.handler;

        return this._rows.map((value, i) => {
            return (
                <ui.Grid.Row key={i}>
                    <ui.Button icon="bars" basic className="drag" />
                    {this._cols.map((col, j) => {
                        const grid = {
                            rows: this._rows.length, columns: this._cols.length,
                            row: i, column: j
                        };
                        const Cell = cellWrapper(col.cell);
                        return (
                            <ui.Grid.Column key={i + '-' + j} width={col.width}>
                                <Cell grid={grid} value={value} error={validator.errorFn(fuseId, i)} />
                            </ui.Grid.Column>
                        );
                    })}
                    <ui.Grid.Column key={i + '-' + this._cols.length} width={1}>
                        <ui.Button icon="trash" color="red" basic onClick={() => removeRecord(i)} />
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