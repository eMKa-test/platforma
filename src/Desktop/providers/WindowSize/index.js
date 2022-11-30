/* eslint-disable react/no-unused-state */
import React from "react";
import * as PropTypes from "prop-types";
import throttle from "lodash/throttle";
import { asideWidth, headerHeight } from "../../common/constants";

const WindowSize = React.createContext({
    clientWidth: 0,
    clientHeight: 0,
    screenX: document.body.clientWidth - asideWidth,
    screenY: document.body.clientHeight - headerHeight,
});

export class WindowSizeProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientWidth: 0,
            clientHeight: 0,
            screenX: document.body.clientWidth - asideWidth,
            screenY: document.body.clientHeight - headerHeight,
        };
    }

    componentDidMount() {
        window.addEventListener("resize", this.throttledEL);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.throttledEL);
    }

    throttledEL = throttle(() => this.setSizeViewport(), 133.3);

    setSizeViewport = () => {
        const { clientWidth, clientHeight } = document.body;
        this.setState({
            clientWidth,
            clientHeight,
            screenX: clientWidth - asideWidth,
            screenY: clientHeight - headerHeight,
        });
    };

    render() {
        return (
            <WindowSize.Provider value={this.state}>
                {this.props.children}
            </WindowSize.Provider>
        );
    }
}

WindowSizeProvider.propTypes = {
    children: PropTypes.element.isRequired,
};

export const WindowSizeConsumer = WindowSize.Consumer;
