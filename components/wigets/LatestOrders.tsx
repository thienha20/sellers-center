import React, {FC, useEffect, useState} from "react";
import {TabOrderDashboard} from "../tabs/tabOrderDashboard";
import {OrderTableDashboard} from "../tables/orderTableDashboard";
import {useIntl} from "react-intl";
import {useLang} from "../i18n/Metronici18n";
import axios from "axios";
import moment from "../../utils/time";
import {Obj} from "../../utils/types";
import {fnCurrentApiUrl} from "../../utils/url";

const LatestOrders: FC = () => {
    const intl = useIntl()
    const [orderList, setOrderList] = useState<Obj[]>([])
    const [orderStatus, setOrderStatus] = useState<string>("")
    const lang: string = useLang() ?? "vi"

    useEffect(() => {
        const call_api = (status: string) => {
            return axios.post(fnCurrentApiUrl("/api/orders"), {
                page: 1,
                items_per_page: 10,
                order_status: status,
                date_from: moment().subtract(7,'days').format(lang === "vi" ? "DD/MM/YYYY" : "MM/DD/YYYY"),
                date_to: moment().add(1,'days').format(lang === "vi" ? "DD/MM/YYYY" : "MM/DD/YYYY"),
                lang_code: lang,
            })
        }
        call_api(orderStatus).then(rs => {
            if(rs.data.data){
                setOrderList(rs.data.data)
            }else{
                setOrderList([])
            }
        })

    }, [orderStatus])

    return (<div className="card card-xxl-stretch mb-5 mb-xl-8">
            <div className="card-header border-0 pt-5">
                <h3 className="card-title align-items-start flex-column">
                    <span className="card-label fw-bolder fs-3 mb-1">{intl.formatMessage({id: 'LANGUAGE.LATEST_ORDER_IN_WEEK'})}</span>
                </h3>
                <div className="card-toolbar">
                    <TabOrderDashboard submitLinkStatus={setOrderStatus} haveBottom={true}/>
                </div>
            </div>
            <div className="card-body py-3">
                <div className="tab-content">
                    <div className="tab-pane fade active show" id="kt_table_widget_5_tab_1">
                        <div className="table-responsive">
                            <OrderTableDashboard orders={orderList}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export {LatestOrders}
