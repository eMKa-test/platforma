import React from "react";
import { render } from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducers from "./store/reducers";
import AgentPage from "./views/AgentPage";
import "bootstrap/dist/css/bootstrap.css";
import "./style.css";

const store = createStore(reducers);

class App extends React.Component {
    componentDidMount() {
        document.getElementById("site-loader").style.display = "none";
    }

    render() {
        return (
            <Provider store={store}>
                <AgentPage />
            </Provider>
        );
    }
}

render(
    <App />,
    document.getElementById("root"),
);
