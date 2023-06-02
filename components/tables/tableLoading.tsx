import React, {useEffect, useMemo, useState} from "react"
import _ from "lodash"
import {Spinner} from "react-bootstrap";
type propsTable = {
}

const TableLoading: (props: propsTable) => JSX.Element = (props: propsTable) => {
    return (
        <div className="table-loading-message">
            <span className={`m-2`}>
                <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                /></span>
            <span>Loading...</span>
        </div>
    )
}

export {TableLoading}
