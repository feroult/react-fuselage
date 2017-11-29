import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react'

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

const DefaultGridComponent = (props) => {
    return (
        <section>
            <button onClick={props.addRecord}>Add</button>
            <table>
                <tbody>{props.children}</tbody>
            </table>
        </section>
    );
};

const DefaultGridRowComponent = (props) => {
    return (
        <tr>
            {props.children}
        </tr>
    );
};

const DefaultGridColumnComponent = (props) => {
    return (
        <td>
            {props.children}
        </td>
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
            removeRecordAt = (index) => rows.splice(index, 1),
            gridComponent: Grid = DefaultGridComponent,
            rowComponent: Row = DefaultGridRowComponent,
            columnComponent: Column = DefaultGridColumnComponent
        } = this.props;

        return (
            <Grid addRecord={addRecord}>
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
                                <RemoveButton action={() => removeRecordAt(i)}/>
                            </Column>
                        </Row>
                    )
                })}
            </Grid>
        );
    }
});

// Navigation

const gridClassName = (grid) => `__grid-row${grid.row}-column${grid.column}__`;

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