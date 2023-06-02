import {Obj} from "./types";
import _ from  "lodash";

export const Permission: Obj = {
    dashboard: {
        title: {
            vi: "Bảng điều khiển",
            en: "Dashboard"
        },
        link: "/"
    },
    products: {
        title: {
            vi: "Quản trị sản phẩm",
            en: "Product Manage"
        },
        data: [
            {
                title: {
                    vi: "Xem danh sách sản phẩm",
                    en: "Product listing"
                },
                link: "/products"
            },
            {
                title: {
                    vi: "Thêm sản phẩm",
                    en: "Add product"
                },
                link: "/products/create"
            },
            {
                title: {
                    vi: "Cập nhật sản phẩm",
                    en: "Edit product"
                },
                link: "/products/update/[id]"
            },
            {
                title: {
                    vi: "Cập nhật sản phẩm tạm, sản phẩm chờ duyệt",
                    en: "Edit product"
                },
                link: "/products/update/temporaries_product/[id]"
            },
            {
                title: {
                    vi: "Xóa sản phẩm",
                    en: "Delete product"
                },
                link: "/products/delete/[id]"
            },
            {
                title: {
                    vi: "Thêm /chỉnh sửa sản phẩm hàng loạt",
                    en: "Add/Edit Multi Products"
                },
                link: "/products/sell-this"
            },
            {
                title: {
                    vi: "Quản lý đánh giá",
                    en: "Product discussion"
                },
                link: "/products/discussion"
            }
        ]
    },
    orders: {
        title: {
            vi: "Quản trị Đơn hàng",
            en: "Order Manage"
        },
        data: [
            {
                title: {
                    vi: "Xem danh sách đơn hàng B2C",
                    en: "Order listing B2C"
                },
                link: "/orders"
            },
            {
                title: {
                    vi: "Xem danh sách đơn hàng B2B",
                    en: "Order listing B2B"
                },
                link: "/orders/b2b"
            },
            {
                title: {
                    vi: "Xem / Cập nhật chi tiết đơn hàng",
                    en: "Order detail"
                },
                link: "/orders/[order_nr]"
            },
            {
                title: {
                    vi: "TAT giao hàng",
                    en: "TAT Shipment"
                },
                link: "/orders/tat-shipment"
            },
            {
                title: {
                    vi: "Nhà bán tự vận hành",
                    en: "Seller Operate"
                },
                link: "/orders/seller-operate"
            },
            {
                title: {
                    vi: "Giao hàng thẳng từ nhà bán",
                    en: "Seller Shipment"
                },
                link: "/order/seller-shipment"
            },
            {
                title: {
                    vi: "Quản lý hóa đơn",
                    en: "Bill Management"
                },
                link: "/orders/bill-manage"
            }
        ]
    },
    marketing: {
        title: {
            vi: "Marketing",
            en: "Marketing"
        },
        data: [
            {
                title: {
                    vi: "Xem danh sách Marketing",
                    en: "Marketing listing"
                },
                link: "/marketing"
            },
            {
                title: {
                    vi: "Khuyến mãi",
                    en: "Promotion"
                },
                link: "/marketing/promotion"
            }
        ]
    },
    reports: {
        title: {
            vi: "Báo cáo",
            en: "Reports"
        },
        data: [
            {
                title: {
                    vi: "Xem Báo cáo",
                    en: "View Reports "
                },
                link: "/reports"
            }
        ]
    },
    users: {
        title: {
            vi: "Quản trị tài khoản",
            en: "Users Manage"
        },
        data: [
            {
                title: {
                    vi: "Xem danh sách quản trị viên",
                    en: "Users listing"
                },
                link: "/users"
            },
            {
                title: {
                    vi: "Thêm quản trị viên",
                    en: "Add user"
                },
                link: "/users/create"
            },
            {
                title: {
                    vi: "Cập nhật quản trị viên",
                    en: "Edit user"
                },
                link: "/users/update/[id]"
            },
            {
                title: {
                    vi: "Xóa quản trị viên",
                    en: "Delete user"
                },
                link: "/users/delete/[id]"
            },
            {
                title: {
                    vi: "Quản lý vai trò",
                    en: "Manage roles"
                },
                link: "/users/vendor_group_permission"
            },
            {
                title: {
                    vi: "Xem vai trò",
                    en: "View role"
                },
                link: "/users/vendor_group_permission/[id]"
            },
            {
                title: {
                    vi: "Tạo vai trò",
                    en: "Create role"
                },
                link: "/users/vendor_group_permission/create"
            },
            {
                title: {
                    vi: "Cập nhật vai trò",
                    en: "Update role"
                },
                link: "/users/vendor_group_permission/edit/[id]"
            }
        ]
    },
    auth: {
        title: {
            vi: "Quản trị thông tin quản trị viên",
            en: "Auth Manage"
        },
        data: [
            {
                title: {
                    vi: "Thay đổi thông tin",
                    en: "Profile"
                },
                link: "/users/profile"
            },
            {
                title: {
                    vi: "Thay đổi mật khẩu",
                    en: "Change pass"
                },
                link: "/users/change-pass"
            }
        ]
    },
}

export const WhiteListPermission: string[] = [
    "/users/profile",
    "/users/change-pass",
    "/companies",
    "/companies/description",
    "/companies/plan",
]

export function checkRouterPermission(routerPath: string, permission?: string[] | null | boolean): boolean {
    if(permission === false) return false
    if (WhiteListPermission.includes(routerPath)) {
        return true
    }
    if(typeof permission !== "boolean"){
        if (!permission || permission.length === 0) return true
        return permission.includes(routerPath)
    }
    return false
}

export const TATMART_SELLERS_COMPANY_ID: string[] = [
    '98',
    '169'
]

export const PermissionUpdateProductDetail: Obj = {
    'PRODUCT_IMAGE': false,
    'PRODUCT_NAME': false ,
    'PRODUCT_CATEGORY': false,
    'PRODUCT_FEATURE': false,
    'PRODUCT_VARIATION': false,
    'PRODUCT_VARIANT': true,
    'PRODUCT_DESCRIPTION': false,
    'PRODUCT_SHIPPING': false,
}

export function checkUpdateProductDetailPermission(block:string, currentCompanyId: string|number, originalCompanyId: string|number):boolean {
    if(`${originalCompanyId}` == '0') {
        if( TATMART_SELLERS_COMPANY_ID.includes(`${currentCompanyId}`)){
            return true
        }
    } else if( !_.isEqual(currentCompanyId, originalCompanyId)){
        return true
    }
    return PermissionUpdateProductDetail[block]
}
