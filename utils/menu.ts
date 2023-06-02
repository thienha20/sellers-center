import {Obj} from "./types"

//menu trên header
export const menuHeader: Obj[] = [
    {
        name: "LANGUAGE.ORDERS",
        url: "/orders",
        icon: "",
        children: [
            {
                name: "MENU.PAGES",
                url: "",
                icon: "",
                children: [
                    {
                        name: "MENU.PAGES",
                        url: "",
                        icon: "",
                        children: [
                            {
                                name: "MENU.FEATURES",
                                url: "",
                                icon: ""
                            },
                            {
                                name: "MENU.NEW",
                                url: "",
                                icon: ""
                            },
                            {
                                name: "MENU.APPS",
                                url: "",
                                icon: ""
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: "PRODUCT.PRODUCT",
        url: "/products",
        icon: "",
        children: [
            {
                name: "MENU.PAGES",
                url: "",
                icon: "",
                children: [
                    {
                        name: "MENU.PAGES",
                        url: "",
                        icon: ""
                    }
                ]
            }
        ]
    },
    {
        name: "LANGUAGE.USERS",
        url: "/users",
        icon: "",
        children: [
            {
                name: "MENU.PAGES",
                url: "",
                icon: "",
            },
            {
                name: "MENU.PAGES",
                url: "",
                icon: "",
            },
            {
                name: "MENU.PAGES",
                url: "",
                icon: "",
            }
        ]
    }
]

//menu bên góc trái
export const asideMenu: Obj[] = [
    {
        header: "",
        children: [
            {
                url: '/',
                icon: '/media/icons/duotune/art/art002.svg',
                title: 'MENU.DASHBOARD',
                fontIcon: 'bi-app-indicator'
            }
        ]
    },
    {
        header: "",
        children: [
            {
                // url: '',
                title: 'LANGUAGE.PRODUCT',
                // fontIcon: 'bi-archive',
                icon: '/media/icons/duotune/ecommerce/ecm007.svg',
                children: [
                    {
                        url: '/products',
                        title: 'LANGUAGE.PRODUCT_MANAGE'
                    },
                    {
                        url: '/products/create',
                        title: 'LANGUAGE.PRODUCT_ADD'
                    },
                    {
                        url: '/products/sell-this',
                        title: 'LANGUAGE.SELL_THIS'
                    }
                ]
            }
        ]
    },
    {
        header: "LANGUAGE.ORDERS",
        children: [
            {
                url: '/orders',
                title: 'LANGUAGE.ORDER_MANAGE',
                icon: '/media/icons/duotune/ecommerce/ecm001.svg'
            },
            {
                url: '/orders/b2b',
                title: 'LANGUAGE.ORDER_MANAGE_B2B',
                icon: '/media/icons/duotune/finance/fin006.svg'
            },
            {
                url: '/orders/tat-shipment',
                title: 'LANGUAGE.TAT_SHIPMENT',
                icon: '/media/icons/duotune/ecommerce/ecm008.svg'
            },
            {
                url: '/orders/seller-operate',
                title: 'LANGUAGE.SELLER_OPERATE',
                icon: '/media/icons/duotune/ecommerce/ecm004.svg'
            },
            {
                url: '/order/seller-shipment',
                title: 'LANGUAGE.SELLER_SHIPMENT',
                fontIcon: 'bi-archive',
                icon: '/media/icons/duotune/ecommerce/ecm006.svg'
            },
            {
                url: '/orders/bill-manage',
                title: 'LANGUAGE.BILL_MANAGE',
                fontIcon: 'bi-archive',
                icon: '/media/icons/duotune/ecommerce/ecm010.svg'
            }
        ]
    },

    {
        header: 'LANGUAGE.MARKETING',
        children: [
            {
                url: '/marketing',
                title: 'LANGUAGE.MARKETING',
                fontIcon: 'bi-archive',
                icon: '/media/icons/duotune/abstract/abs039.svg'
            },
            {
                url: '/marketing/promotion',
                title: 'LANGUAGE.PROMOTION',
                fontIcon: 'bi-archive',
                icon: '/media/icons/duotune/ecommerce/ecm011.svg'
            }
        ]
    },
    {
        header: 'LANGUAGE.REPORTS',
        children: [
            {
                url: '/reports',
                title: 'LANGUAGE.REPORTS',
                fontIcon: 'bi-archive',
                icon: '/media/icons/duotune/graphs/gra012.svg'
            }
        ]
    },
    {
        header: 'LANGUAGE.USERS',
        children: [
            {
                url: '/users',
                title: 'LANGUAGE.USER_MANAGE',
                fontIcon: 'bi-archive',
                icon: '/media/icons/duotune/communication/com005.svg'
            },
            {
                url: '/users/create',
                title: 'LANGUAGE.USER_ADD',
                fontIcon: 'bi-archive',
                icon: '/media/icons/duotune/communication/com006.svg'
            }
        ]
    },
]