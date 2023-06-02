import React, {ChangeEvent, MouseEvent, useCallback, useEffect, useMemo, useState} from "react"
import {useIntl} from "react-intl"
import {isMobileDevice} from "../../utils/metronic/_utils"
import _ from "lodash"

type propsPagination = {
    total_items: number,
    current_page: number,
    items_per_page: number,
    onChangePage?: Function
}

const defaultItemsPerPageList = [10, 25, 50, 100]

const Pagination: (props: propsPagination) => JSX.Element = (props: propsPagination) => {

    const intl = useIntl()
    const {total_items, current_page, items_per_page, onChangePage} = {...props}
    const [currentPage, setCurrentPage] = useState<number>(current_page ?? 1)
    const [itemsPerPage, setItemsPerPage] = useState<number>(items_per_page ?? 10)
    const [totalItems, setTotalItems] = useState<number>(total_items ?? 0)
    const [lastPage, setLastPage] = useState<number>(itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : 0)
    const [isMobile, setIsMobile] = useState<boolean>(isMobileDevice())
    const [pages, setPages] = useState<JSX.Element[]>([])

    useEffect(() => {
        setCurrentPage(current_page)
    }, [current_page])

    useEffect(() => {
        setTotalItems(total_items)
    }, [total_items])

    useEffect(() => {
        setItemsPerPage(items_per_page)
    }, [items_per_page])

    useEffect(() => {
        if (itemsPerPage > 0) {
            setLastPage(Math.ceil(totalItems / itemsPerPage))
        } else {
            setLastPage(0)
        }

    }, [totalItems, itemsPerPage])

    const itemsPerPageList = useMemo(() => defaultItemsPerPageList.map((amount: number) => {
        return (
            <option key={`per-page-${amount}`}
                    value={amount}>{amount} {intl.formatMessage({id: 'LANGUAGE.ITEMS_IN_PAGE'})}</option>
        )
    }), [])

    const insertPaginateItem = () => {
        const elementPages: JSX.Element[] = []
        if (lastPage <= 1) {
            return null
        } else {
            for (let i: number = 1; i <= lastPage; i++) {
                //first point
                if (i <= 3) {
                    elementPages.push(<li key={`pagination-${i}`}
                                          className={`paginate_button page-item ${i == currentPage ? "active" : ""}`}>
                            <button
                                value={i}
                                className="page-link"
                                onClick={(e: any) => handleChange(i, itemsPerPage)}
                            >
                                {i}
                            </button>
                        </li>
                    )
                } else {
                    if (i == +currentPage - 4 || i == +currentPage + 4) {
                        elementPages.push(
                            <li key={`pagination-dot-${i}`}
                                className={`paginate_button page-item ${i == currentPage ? "active" : ""}`}>
                                <button
                                    value={i}
                                    className="page-link"
                                    onClick={(e: any) => handleChange(i, itemsPerPage)}
                                >
                                    ...
                                </button>
                            </li>)
                    }
                    //floating mid point
                    if (i <= +currentPage + 2 && i >= +currentPage - 2) {
                        elementPages.push(<li key={`pagination-${i}`}
                                              className={`paginate_button page-item ${i == currentPage ? "active" : ""}`}>
                                <button
                                    value={`${i}`}
                                    className="page-link"
                                    onClick={(e: any) => handleChange(i, itemsPerPage)}
                                >
                                    {i}
                                </button>
                            </li>
                        )
                    } else {
                        //end point
                        if (i == lastPage - 3) {
                            elementPages.push(<li key={`pagination-${i}`}
                                                  className={`paginate_button page-item ${i == currentPage ? "active" : ""}`}>
                                    <button
                                        value={`${i}`}
                                        className="page-link"
                                        onClick={(e: any) => handleChange(i, itemsPerPage)}
                                    >
                                        {i}
                                    </button>
                                </li>
                            )
                        }
                    }

                }
            }
            return elementPages
        }
    }


    const handleChange = (page?: number, itemsPerPage?: number) => {
        setCurrentPage(page ?? 1)
        if (itemsPerPage) {
            setItemsPerPage(itemsPerPage)
            if (onChangePage) {
                onChangePage(page, itemsPerPage)
            }
        }
    }

    //TODO: mobile đổi thành select

    return isMobile ?
        <div className="Pagination row" key={`pagination-${currentPage}-${total_items}`}>
            <div className="col-6">
                <label className="my-2">
                    {intl.formatMessage({id: 'ITEMS_PER_PAGE'})}
                </label>
                <select name="items_per_page" className="form-select form-select-sm form-select-solid"
                        id="items_per_page"
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange(1, +e.target.value)}
                        value={itemsPerPage.toString()}
                >
                    {itemsPerPageList}
                </select>
            </div>
            {lastPage > 1 &&
            <div className="col-6">
                <label className="my-2">
                    {intl.formatMessage({id: 'PAGE'})} ( {intl.formatMessage({id: 'TOTAL'})} {lastPage} )
                </label>
                <div>
                    <input type="number"
                           defaultValue={currentPage}
                           onBlur={_.debounce((e) => {
                               if (e.target.value > 0) {
                                   handleChange(+e.target.value, itemsPerPage)
                               }
                           }, 300)}
                           className="form-control-sm form-control form-control-solid"
                    />
                </div>
            </div>
            }
        </div> :
        <div className="d-flex justify-content-between align-items-center"
             key={`pagination-${currentPage}-${total_items}`}>
            <div className="dataTables_length">
                <label>
                    <select name="items_per_page" className="form-select form-select-sm form-select-solid"
                            id="items_per_page"
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange(1, +e.target.value)}
                            value={itemsPerPage?.toString()}
                    >
                        {itemsPerPageList}
                    </select>
                </label>
            </div>
            <div className="paging_simple_numbers">
                <ul className="pagination">
                    {lastPage > 1 &&
                    <li className={`paginate_button page-item previous ${currentPage == 1 ? "disabled" : ""}`}>
                        <button
                            onClick={(e: MouseEvent<HTMLButtonElement>) => handleChange(1, itemsPerPage)}
                            className="page-link"><i className="previous"></i></button>
                    </li>
                    }
                    {insertPaginateItem()}
                    {lastPage > 1 &&
                    <li className={`page-item next ${currentPage == lastPage ? "disabled" : ""}`}>
                        <button className="page-link"
                                onClick={(e: MouseEvent<HTMLButtonElement>) => handleChange(lastPage, itemsPerPage)}>
                            <i className="next"></i>
                        </button>
                    </li>
                    }
                </ul>
            </div>
        </div>
}

export {Pagination}
