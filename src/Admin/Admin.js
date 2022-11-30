import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import Modal from "react-modal";

import { ROUTER_ROOT, GET_OPERATOR } from "Admin/constants";
import store, { persistor } from "Admin/store";

import DefaultLayout from "Admin/layout/DefaultLayout";

Modal.setAppElement("#root");

const onBeforeLift = () => {
    store.dispatch({
        type: GET_OPERATOR,
    });
};

const Admin = () => (
    <Provider store={store}>
        <PersistGate
            loading={null}
            onBeforeLift={onBeforeLift}
            persistor={persistor}>
            <BrowserRouter>
                <Route
                    path={ROUTER_ROOT}
                    component={DefaultLayout} />
            </BrowserRouter>
        </PersistGate>
    </Provider>
);

export default Admin;
