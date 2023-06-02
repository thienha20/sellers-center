// action - state management
import actionTypes from '../types';

type settingState = {
    securityHash: string
    timerOld?: number
    timerNew?: number
    codeSmsOld?: string
    codeSmsNew?: string
    timerEmailOld?: number
    timerEmailNew?: number
    codeEmailOld?: string
    codeEmailNew?: string
    stopScrollNav?: boolean
}

const initialState: settingState = {
    securityHash: '',
    timerOld: 0,
    timerNew: 0,
    codeSmsOld: '',
    codeSmsNew: '',
    timerEmailOld: 0,
    timerEmailNew: 0,
    codeEmailOld: '',
    codeEmailNew: '',
    stopScrollNav: true
};

// ===========================|| CUSTOMIZATION REDUCER ||=========================== //

const settingsReducer = (state: settingState = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.SECURITYHASH:
            return {
                ...state,
                securityHash: action.payload
            };
        case actionTypes.TIME_LIMITER:
            if(action.payload.type === "old")
                return {
                    ...state,
                    timerOld: action.payload.time
                };
            return {
                ...state,
                timerNew: action.payload.time
            };
        case actionTypes.CODE_SMS:
            if(action.payload.type === "old")
                return {
                    ...state,
                    codeSmsOld: action.payload.code
                };
            return {
                ...state,
                codeSmsNew: action.payload.code
            };
        case actionTypes.CODE_EMAIL:
            // console.log(action.payload)
            // console.log({
            //     ...state,
            //     codeEmailOld: action.payload.code
            // })
            if(action.payload.type === "old")
                return {
                    ...state,
                    codeEmailOld: action.payload.code
                };
            return {
                ...state,
                codeEmailNew: action.payload.code
            };
        case actionTypes.TIME_EMAIL_LIMITER:
            if(action.payload.type === "old")
                return {
                    ...state,
                    timerEmailOld: action.payload.time
                };
            return {
                ...state,
                timerEmailNew: action.payload.time
            };
        case actionTypes.STOP_SCROLL_NAV:
            return {
                ...state,
                stopScrollNav: action.payload
            };
        default:
            return state;
    }
};

export default settingsReducer;
