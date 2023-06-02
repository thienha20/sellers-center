import React, {ReactElement, useMemo} from "react";
import {useIntl} from "react-intl";
import moment from 'moment'

type propsTable = {
    orderHistories: any //TODO: declare this
}

const OrderHistoryTable: (props: propsTable) => JSX.Element = (props: propsTable) => {
    const intl = useIntl()
    const { orderHistories } = { ...props }
    const list_status: { value: string, label: string }[] = useMemo(() => [
        { value: 'N', label: intl.formatMessage({ id: 'LANGUAGE.UNPAID' }) },
        { value: 'W', label: intl.formatMessage({ id: 'LANGUAGE.REQUIRES_APPROVAL' }) },
        { value: 'P', label: intl.formatMessage({ id: 'LANGUAGE.PAID' }) },
        { value: 'O', label: intl.formatMessage({ id: 'LANGUAGE.WAITING_CONFIRM' }) },
        { value: 'Y', label: intl.formatMessage({ id: 'LANGUAGE.WAITING_CONFIRMATION_CALL' }) },
        { value: 'A', label: intl.formatMessage({ id: 'LANGUAGE.CONFIRMED' }) },
        { value: 'E', label: intl.formatMessage({ id: 'LANGUAGE.PACKING' }) },
        { value: 'G', label: intl.formatMessage({ id: 'LANGUAGE.HANDED_OVER_AND_SHIPPED' }) },
        { value: 'H', label: intl.formatMessage({ id: 'LANGUAGE.DELIVERY' }) },
        { value: 'C', label: intl.formatMessage({ id: 'LANGUAGE.DELIVERY_SUCCESSFUL' }) },
        { value: 'F', label: intl.formatMessage({ id: 'LANGUAGE.DELIVERY_FAILED' }) },
        { value: 'D', label: intl.formatMessage({ id: 'LANGUAGE.CANCELLED_BY_SELLER' }) },
        { value: 'I', label: intl.formatMessage({ id: 'LANGUAGE.CANCELLED_BY_CUSTOMER' }) },
        { value: 'B', label: intl.formatMessage({ id: 'LANGUAGE.RETURNS' }) }
    ],[intl])
    let _list_status: any = {}
    list_status.forEach(s => {
        _list_status[`${s.value}`] = s.label
    })

    const data: ReactElement = useMemo(() => orderHistories.map((history: any) => {
        return (
            <tr key={`tr-${history.log_id}`}>
                <td>
                    {moment.unix(history.timestamp).format("MM/DD/YYYY HH:mm")}
                </td>
                <td>
                    {_list_status[history.content.status_from]} -&gt;  {_list_status[history.content.status_to]}
                </td>
                {/*<td>*/}
                {/*    --*/}
                {/*</td>*/}
                {/*<td>*/}
                {/*    {history.message}*/}
                {/*</td>*/}
            </tr>
        )
    }), [orderHistories]);
    return (
        <div className="table-responsive">
            <table className="productTable table table-row-bordered table-row-dashed gy-4 align-middle fw-bolder dataTable">
                <thead className={'fs-7 text-gray-400 text-uppercase'}>
                    <tr>
                        <th scope="col">
                            {intl.formatMessage({ id: 'LANGUAGE.DAY' })}
                        </th>
                        <th scope="col">
                            {intl.formatMessage({ id: 'LANGUAGE.ACTION' })}
                        </th>
                        {/*<th scope="col">*/}
                        {/*    {intl.formatMessage({ id: 'ORDER.USER' })}*/}
                        {/*</th>*/}
                        {/*<th scope="col">*/}
                        {/*    {intl.formatMessage({ id: 'LANGUAGE.COMMENT' })}*/}
                        {/*</th>*/}
                    </tr>
                </thead>
                <tbody className={'fs-7 border-top-0'}>
                    {data}
                </tbody>
            </table>
        </div>
    );
}

export { OrderHistoryTable }
