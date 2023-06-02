import {NextPage} from "next";
import {ReactElement, ReactNode} from "react"

export type NextPageWithLayout<P = null> = NextPage<P> & {
    getLayout?: (page: ReactElement) => ReactNode
}

export type Obj = {[key: string]: any}