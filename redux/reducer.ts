import {combineReducers, Reducer} from 'redux';

// reducer import
import customizationReducer from './reducers';

// ===========================|| COMBINE REDUCER ||=========================== //

const reducer: Reducer = combineReducers({
    ...customizationReducer
});

export default reducer;
