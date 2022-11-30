import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.css";
import "simple-line-icons/css/simple-line-icons.css";
import "font-awesome/css/font-awesome.min.css";

import "@coreui/icons/css/all.css";
import "rc-pagination/assets/index.css";
import "rc-select/assets/index.css";

import "./coreui.css";
import "./styles.css";

import Admin from "./Admin";

document.documentElement.className += "ontouchstart" in document.documentElement ? "touch" : "no-touch";

class App extends React.Component {
    componentDidMount() {
        document.getElementById("site-loader").style.display = "none";
    }

    render() {
        return (
            <Admin />
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
