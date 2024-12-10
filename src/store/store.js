"use client"

import { legacy_createStore as createStore } from "redux"
import { combineReducers, applyMiddleware, compose } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk"
import uiReducer from "../store/ui";
import sessionReducer from "../store/session"


let enhancer;
if (import.meta.env.MODE === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?? compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const rootReducer = combineReducers({
    ui: uiReducer,
    session: sessionReducer
})

const store = createStore(rootReducer, enhancer)
  
export default store;
  
  