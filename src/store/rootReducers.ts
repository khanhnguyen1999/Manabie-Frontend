import { combineReducers } from 'redux';

import todoReducer from './reducer'

const rootReducer = combineReducers({ todo: todoReducer });

export default rootReducer;