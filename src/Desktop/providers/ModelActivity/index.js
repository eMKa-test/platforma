import React, { Component } from "react";
import * as PropTypes from "prop-types";

const callback = () => {};

const ModelActivityContext = React.createContext({
    modeModel: false,
    loadRun: false,
    cacheModel: {},
    showModel: callback,
    runLoadModel: callback,
    setCacheModel: callback,
});

class ProvideModelActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modeModel: false,
            loadRun: false,
            cacheModel: {},
        };
    }

    showModel = (modeModel) => {
        this.setState({ modeModel });
    };

    runLoadModel = (loadRun) => {
        this.setState({ loadRun });
    };

    setCacheModel = (cacheModel) => {
        this.setState({ cacheModel });
    };

    render() {
        return (
            <ModelActivityContext.Provider
                value={{
                    modeModel: this.state.modeModel,
                    showModel: this.showModel,
                    loadRun: this.state.loadRun,
                    runLoadModel: this.runLoadModel,
                    cacheModel: this.state.cacheModel,
                    setCacheModel: this.setCacheModel,
                }}>
                {this.props.children}
            </ModelActivityContext.Provider>
        );
    }
}

ProvideModelActivity.propTypes = {
    children: PropTypes.element.isRequired,
};

export const ModelActivityProvider = ProvideModelActivity;
export const ModelActivityConsumer = ModelActivityContext.Consumer;
export { ModelActivityContext };
