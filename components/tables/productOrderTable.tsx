import React from "react";
import { fnPriceFormat } from "../../utils/price";
import { Obj } from "../../utils/types"
import _ from 'lodash'
import { useIntl } from "react-intl";
import Image from "next/image";

type propsTable = {
    products: Obj
}

const ProductOrderTable: (props: propsTable) => JSX.Element = (props) => {
    const intl = useIntl()
    const { products } = props;
    const header = [
        intl.formatMessage({id: 'PRODUCT.PRODUCT'}),
        intl.formatMessage({id: 'LANGUAGE.PRICE'}),
        intl.formatMessage({id: 'LANGUAGE.PRODUCT_AMOUNT'}),
        intl.formatMessage({id: 'ORDER.PROVISIONAL'})
    ]

    const tableHeader = header.map(product_props => {
        return (
            <th key={`th-${product_props}`} scope="col">
                {product_props}
            </th>)
    })
    const data = (p: Obj) => {
        const new_products: JSX.Element[] = [];
        if (!_.isEmpty(p)) {
            Object.entries(p).forEach(
                ([key, value]) =>
                    new_products.push(
                        <tr key={`tr-${value.product_id}`}>
                            <td>
                                <div className="d-flex align-items-center">
                                    <div className="symbol symbol-45px me-5">

                                        <Image
                                            src={!_.isEmpty(value.image_path) ? value.image_path :  "/media/products/no_image.png"}
                                            alt=""
                                            width={45}
                                            height={45}
                                        />
                                    </div>
                                    <div
                                        className="d-flex justify-content-start flex-column fw-bold tat-text-blue text-hover-primary fs-6">
                                        {value.product}
                                    </div>
                            </div>
                            </td>
                            <td>
                                {fnPriceFormat(value.price)}
                            </td>
                            <td>
                                {value.amount}
                            </td>
                            <td>
                                {fnPriceFormat(value.price * value.amount)}
                            </td>
                        </tr>
                    )
            );
        }
        return new_products;
    }
    return (
        <div className="table-responsive">
            <table className="productTable table table-row-bordered table-row-dashed gy-4 align-middle fw-bolder dataTable">
                <thead className={'fs-7 text-gray-400 text-uppercase'}>
                    <tr>
                        {tableHeader}
                    </tr>
                </thead>
                <tbody className={'fs-7 border-top-0'}>
                    {data(products)}
                </tbody>
            </table>
        </div>
    );
}

export { ProductOrderTable }
