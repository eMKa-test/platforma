import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import localStorage from "redux-persist/lib/storage";
import sagaMiddlewareFactory from "redux-saga";

import reducers from "Admin/store/reducers";
import rootSaga from "Admin/store/sagas";

const persistConfig = {
    key: "PlatformaPersistConfig",
    storage: localStorage,
    blacklist: [
        "navigation",
        "router",
        "routes",
        "navConfig",
        // "objects",
        // "users",
        // "currentObject",
        // "currentLine",
        // "general",
    ],
};

const persistedReducers = persistReducer(persistConfig, reducers);

const sagaMiddleware = sagaMiddlewareFactory();

// eslint-disable-next-line
const composeEnhancers = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(persistedReducers, composeEnhancers(applyMiddleware(sagaMiddleware)));
const persistor = persistStore(store);

export { persistor };
export default store;

sagaMiddleware.run(rootSaga);
