// rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';
import authReducer from '../context/authReducer';

const rootReducer = combineReducers({
  api: apiSlice,
  auth: authReducer
  // ... other reducers
});

export default rootReducer;