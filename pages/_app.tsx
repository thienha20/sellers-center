import type {AppProps} from 'next/app'
import {Provider} from 'react-redux'
import redux from '../redux'
import {PersistGate} from 'redux-persist/integration/react'
import React from 'react'
import {MetronicI18nProvider} from "../components/i18n/Metronici18n"
import '../assets/styles/style.scss'
import '../assets/styles/style.react.scss'
import 'bootstrap-daterangepicker/daterangepicker.css'
import {I18nProvider} from "../components/i18n/i18nProvider"
import {transitions, positions, Provider as AlertProvider, AlertComponentPropsWithStyle} from 'react-alert'
import NextNProgress from 'nextjs-progressbar'
import {LayoutProvider} from "../components/layout/core"
import {NextPage} from "next"
import {NextPageWithLayout} from "../utils/types"
import TwinSpin from "../components/loading/TwinSpin"
import 'react-modern-drawer/dist/index.css'
import '../assets/styles/main.scss'
import "@fortawesome/fontawesome-svg-core/styles.css"
import "react-checkbox-tree/lib/react-checkbox-tree.css"

const options = {
    position: positions.TOP_RIGHT,
    timeout: 7000,
    offset: '30px',
    transition: transitions.SCALE,
    containerStyle: {
        zIndex: 99999
    }
}

const AlertTemplate = ({style, options, message, close}: AlertComponentPropsWithStyle): JSX.Element => (
    <div
        className={`alert alert-dismissible bg-${options?.type === 'info' ? 'primary' : `${options?.type === 'success' ? 'success' : 'danger'}`} d-flex flex-column flex-sm-row p-5 mb-10 mt-5`}
        style={style}>
        <span className="svg-icon svg-icon-2hx svg-icon-light me-4 mb-5 mb-sm-0">
             {options?.type === 'info' && (
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                      className="mh-50px">
                     <path opacity="0.3"
                           d="M12 22C13.6569 22 15 20.6569 15 19C15 17.3431 13.6569 16 12 16C10.3431 16 9 17.3431 9 19C9 20.6569 10.3431 22 12 22Z"
                           fill="black"></path>
                     <path
                         d="M19 15V18C19 18.6 18.6 19 18 19H6C5.4 19 5 18.6 5 18V15C6.1 15 7 14.1 7 13V10C7 7.6 8.7 5.6 11 5.1V3C11 2.4 11.4 2 12 2C12.6 2 13 2.4 13 3V5.1C15.3 5.6 17 7.6 17 10V13C17 14.1 17.9 15 19 15ZM11 10C11 9.4 11.4 9 12 9C12.6 9 13 8.6 13 8C13 7.4 12.6 7 12 7C10.3 7 9 8.3 9 10C9 10.6 9.4 11 10 11C10.6 11 11 10.6 11 10Z"
                         fill="black"></path>
                 </svg>)
             }
            {options?.type === 'error' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                     className="mh-50px">
                    <path opacity="0.3"
                          d="M2 4V16C2 16.6 2.4 17 3 17H13L16.6 20.6C17.1 21.1 18 20.8 18 20V17H21C21.6 17 22 16.6 22 16V4C22 3.4 21.6 3 21 3H3C2.4 3 2 3.4 2 4Z"
                          fill="black"></path>
                    <path
                        d="M18 9H6C5.4 9 5 8.6 5 8C5 7.4 5.4 7 6 7H18C18.6 7 19 7.4 19 8C19 8.6 18.6 9 18 9ZM16 12C16 11.4 15.6 11 15 11H6C5.4 11 5 11.4 5 12C5 12.6 5.4 13 6 13H15C15.6 13 16 12.6 16 12Z"
                        fill="black"></path>
                </svg>)
            }
            {options?.type === 'success' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                     className="mh-50px">
                    <path opacity="0.3"
                          d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z"
                          fill="black"></path>
                    <path
                        d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z"
                        fill="black"></path>
                </svg>)
            }
        </span>
        <div className="d-flex flex-column text-light pe-0 pe-sm-10">
            <h5 className="mb-1">
                {options?.type === 'info' && 'Info'}
                {options?.type === 'success' && 'Success'}
                {options?.type === 'error' && 'Error'}
            </h5>
            {typeof message === "string" ? <span dangerouslySetInnerHTML={{"__html": message ?? ""}}></span> : <span>{message}</span>}
        </div>
        <button type="button" onClick={close}
                className="position-absolute position-sm-relative m-2 m-sm-0 top-0 end-0 btn btn-icon ms-sm-auto">
            <span className="svg-icon svg-icon-2x svg-icon-light">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                     className="mh-50px">
                    <rect opacity="0.5" x="6"
                          y="17.3137" width="16"
                          height="2" rx="1"
                          transform="rotate(-45 6 17.3137)"
                          fill="black"></rect>
                    <rect x="7.41422" y="6" width="16" height="2" rx="1" transform="rotate(45 7.41422 6)"
                          fill="black"></rect>
                </svg>
            </span>
        </button>
    </div>
)

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

const MyApp: React.FC<AppPropsWithLayout> = ({Component, pageProps}: AppPropsWithLayout) => {
    const getLayout = Component.getLayout || ((page: NextPageWithLayout | NextPage) => page)
    return <MetronicI18nProvider>
        <Provider store={redux.store}>
            <PersistGate loading={<TwinSpin color="#fc2f70" width="100px" height="100px" duration="3s"/>} persistor={redux.persistor}>
                <I18nProvider>
                    <AlertProvider template={AlertTemplate} {...options}>
                        <LayoutProvider>
                            <NextNProgress options={{easing: 'ease', speed: 500}}/>
                            {
                                // @ts-ignore
                                getLayout(<Component {...pageProps} />)
                            }
                        </LayoutProvider>
                    </AlertProvider>
                </I18nProvider>
            </PersistGate>
        </Provider>
    </MetronicI18nProvider>
}

export default MyApp
