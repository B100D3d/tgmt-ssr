import React from "react"
import ReactDataGrid from "react-data-grid"
import { AutoSizer } from "react-virtualized"

import "react-data-grid/dist/react-data-grid.css"
import "./data-grid.sass"

const DataGrid = ({ rows, columns, onUpdate, stretch, ...props }) => {
    const onRowsUpdate = (data) => {
        let { toRow, fromRow } = data
        if (data.action === "COPY_PASTE") fromRow = toRow
        if (fromRow > toRow) [toRow, fromRow] = [fromRow, toRow]
        const rowsCount = toRow - fromRow + 1

        onUpdate({ ...data, fromRow, toRow, rowsCount })
    }

    return (
        <AutoSizer>
            {({ width, height }) => (
                <ReactDataGrid
                    rows={rows}
                    columns={columns}
                    width={width}
                    height={height}
                    onRowsUpdate={onRowsUpdate}
                    rowHeight={stretch ? height / (rows.length + 1) : 35}
                    minColumnWidth={width / columns.length}
                    enableCellCopyPaste={true}
                    enableCellDragAndDrop={true}
                    {...props}
                />
            )}
        </AutoSizer>
    )
}

export default DataGrid
