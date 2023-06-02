// https://docs.cs-cart.com/latest/developer_guide/api/entities/products.html

export type OrderSearchParamsType = {
    // search
    search_query?: string, 
    search_order_nr       ?: string,  //Product name
    pshort      ?: string,  //Short description
    pfull       ?: string,  //Full description
    pkeywords   ?: string,  //Meta keywords
    pcode       ?: string,  //Product code
    cid         ?: string,  //Category ID
    amount_from ?: number,  //In stock lower range
    amount_to   ?: number,  //In stock higher range
    price_from  ?: number,  //Price lower range
    price_to    ?: number,  //Price higher range

    status      ?: string,

    //Sorting
    sort_by     ?: string
    sort_order  ?: string,

    //Pagination
    page            ?: number,
    items_per_page  ?: number,
}