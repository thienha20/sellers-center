import React, {useEffect, useMemo, useState} from "react"
import _ from "lodash"
import {Spinner} from "react-bootstrap";
type propsTable = {
    colSpan?: number | undefined,
}


const TableNoData: (props: propsTable) => JSX.Element = (props: propsTable) => {
    const {colSpan} = {...props}

    return (
        <tr>
            <td colSpan={colSpan??1}>
                <div className={'d-flex justify-content-center mt-10 mb-10'}>
                    <span className="indicator-progress" style={{display: 'block'}}>
                        No data
                    </span>
                </div>
            </td>
        </tr>
    )
}

export {TableNoData}
