import React, {FC, useEffect, useState} from "react";
import {useIntl} from "react-intl";
import axios from "axios";
import {Obj} from "../../utils/types";
import dynamic from "next/dynamic";
import _ from "lodash"
import {ApexOptions} from "apexcharts";
import {fnPriceFormat} from "../../utils/price";
import {fnCurrentApiUrl} from "../../utils/url";

const Chart = dynamic(() => import("react-apexcharts"), {ssr: false});

const GraphicToDayOrders: FC = () => {
    const intl = useIntl()
    const [options, setOptions] = useState<ApexOptions>({})
    const [total, setTotal] = useState<number>(0)
    const [series, setSeries] = useState<ApexAxisChartSeries>([{
        data: []
    }])
    const [data, setData] = useState<Obj>({
        options: {
            chart: {
                id: "today",
                zoom: {
                    enabled: !1
                },
                toolbar: {show: !1}
            },
            yaxis: {
                labels: {
                    formatter: (value: number) => {
                        return fnPriceFormat(value);
                    }
                }
            },
            xaxis: {
                categories: [],
                labels: {
                    formatter: (value: string) => {
                        return value + "h";
                    }
                }
            }
        },
        series: [
            {
                name: intl.formatMessage({id: 'LANGUAGE.TOTAL'}),
                data: []
            }
        ]
    })

    useEffect(() => {
        const call_api = () => {
            return axios.post(fnCurrentApiUrl("/api/orders/graphic/today"), {})
        }
        call_api().then(rs => {
            if (!_.isEmpty(rs.data?.dashboard_statistics_sales_chart)) {
                let newData = {...data}
                let elm: string = ""
                let sum: number = 0
                for (elm in rs.data.dashboard_statistics_sales_chart) {
                    newData.options.xaxis.categories.push(elm.replace("time", ""))
                    newData.series[0].data.push(rs.data.dashboard_statistics_sales_chart[elm].cur)
                    sum += rs.data.dashboard_statistics_sales_chart[elm].cur
                }
                setData(newData)
                setTotal(sum)
            }
        })
    }, [])

    useEffect(() => {
        if (data) {
            setOptions(data.options)
            setSeries(data.series)
        }
    }, [data])


    return (<div className="card card-xxl-stretch mb-5 mb-xl-8">
            <div className="card-header border-0 pt-5">
                <h3 className="card-title align-items-start flex-column">
                    <span
                        className="card-label fw-bolder fs-3 mb-1">{intl.formatMessage({id: 'LANGUAGE.STATISTICS_IN_TODAY'})}({fnPriceFormat(total)}) </span>
                </h3>
            </div>
            <div className="card-body py-3 p-0">
                <div className="tab-content">
                    <div className="tab-pane fade active show mixed-chart">
                        {series && series[0]?.data?.length > 0 ? <Chart
                            options={options}
                            series={series}
                            type="line"
                        /> : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

export {GraphicToDayOrders}
