"use client";
import { config, queryClient } from "../config";
import { AlchemyClientState } from "@account-kit/core";
import { AlchemyAccountProvider } from "@account-kit/react";
import { applyMiddleware, compose }from "@reduxjs/toolkit";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { thunk } from "redux-thunk"
import { combineReducers } from "@reduxjs/toolkit";
import uiReducer from "../store/ui";
import sessionReducer from "../store/session"
import { legacy_createStore as createStore } from "redux"

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

const store = createStore(rootReducer, enhancer);


export const Providers = (
  props: PropsWithChildren<{ initialState?: AlchemyClientState }>
) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AlchemyAccountProvider
          config={config}
          queryClient={queryClient}
          initialState={props.initialState}
        >
          {props.children}
        </AlchemyAccountProvider>
      </QueryClientProvider>
    </Provider>
  );
};