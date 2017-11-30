import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import * as mobx from 'mobx';
import {observer} from 'mobx-react'
import Dragula from 'react-dragula';

import './grid-editor.css';

const columnWrapper = (Input) => {
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

const RemoveButton = (props) => {
    return <button onClick={props.action}>Remove</button>;
};

const DragButton = (props) => {
    return <button>Drag</button>;
};

const DefaultGridComponent = class extends Component {
    render() {
        const props = this.props;
        return (
            <section>
                <button onClick={props.addRecord}>Add</button>
                <section className="reb-grid">
                    {props.children}
                </section>
            </section>
        );
    }
};

const DefaultGridRowComponent = (props) => {
    return (
        <div className="reb-grid-row">
            {props.children}
        </div>
    );
};

const DefaultGridColumnComponent = (props) => {
    return (
        <div className="reb-grid-cell">
            {props.children}
        </div>
    );
};

const GridEditor = observer(class extends Component {

    static contextTypes = {
        handler: PropTypes.object
    };

    rowCount = this.props.rows.length;

    get rows() {
        return this.props.rows(this.context.handler.value);
    }

    componentDidUpdate(prevProps, prevState) {
        const rowCount = this.rows.length;

        if (rowCount > this.rowCount) {
            selectInput({
                row: rowCount - 1,
                column: 0
            });
        }
        if (rowCount !== this.rowCount) {
            this.rowCount = rowCount;
        }
    }

    render() {
        const rows = this.rows;

        const {
            columns,
            newRecord = () => ({}),
            addRecord = () => rows.push(newRecord()),
            removeRecord = (index) => rows.splice(index, 1),
            moveRecord = (fromIndex, toIndex) => {
                mobx.runInAction(() => {
                    const record = rows[fromIndex];
                    rows[fromIndex] = rows[toIndex];
                    rows[toIndex] = record;
                });
            },
            gridComponent: Grid = DefaultGridComponent,
            rowComponent: Row = DefaultGridRowComponent,
            columnComponent: Column = DefaultGridColumnComponent
        } = this.props;

        return (
            <Grid addRecord={addRecord} ref={(component) => dragAndDropDecorator(component, moveRecord)}>
                {rows.map((value, i) => {
                    return (
                        <Row key={i}>
                            {columns.map((Input, j) => {
                                const WrappedInput = columnWrapper(Input);
                                const grid = {rows: rows.length, columns: columns.length, row: i, column: j};
                                return (
                                    <Column key={i + '-' + j}>
                                        <WrappedInput grid={grid} value={value}/>
                                    </Column>
                                );
                            })}
                            <Column key={i + '-' + columns.length}>
                                <RemoveButton action={() => removeRecord(i)}/>
                            </Column>
                            <Column key={i + '-' + columns.length + 1}>
                                <DragButton/>
                            </Column>
                        </Row>
                    )
                })}
            </Grid>
        );
    }

});

// UI Behavior

const gridClassName = (grid) => `__grid-row${grid.row}-column${grid.column}__`;

const dragAndDropDecorator = (component, moveFn) => {
    if (!component) {
        return;
    }

    const grid = ReactDOM.findDOMNode(component).querySelector('.reb-grid');

    if (grid.getAttribute('data-reb-grid') === 'on') {
        return;
    } else {
        grid.setAttribute('data-reb-grid', 'on')
    }

    const drake = Dragula([grid]);

    let fromIndex;
    drake.on('drag', (el, target, source, sibling) => {
        fromIndex = [...el.parentElement.children].indexOf(el);
    });

    drake.on('drop', (el, target, source, sibling) => {
        const toIndex = [...el.parentElement.children].indexOf(el);
        moveFn(fromIndex, toIndex);
        drake.cancel(true);
    });
};

const handleVerticalNavigation = (event, grid) => {
    event.preventDefault();

    let {row, column} = grid;

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

    selectInput({row, column});
};

const handleHorizontalNavigation = (event, grid) => {
    event.preventDefault();

    let {row, column} = grid;

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

    selectInput({row, column});
};

const selectInput = (grid) => {
    const className = gridClassName(grid);
    const input = document.getElementsByClassName(className)[0].firstChild;
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

export {GridEditor};