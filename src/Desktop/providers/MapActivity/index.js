import React, { Component } from "react";
import * as PropTypes from "prop-types";

const callback = () => {};

const MapActivityContext = React.createContext({
    modeMap: false,
    showMap: callback,
});

class ProvideMapActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modeMap: false,
        };
    }

    showMap = (modeMap) => {
        this.setState({
            modeMap,
        });
    };

    render() {
        return (
            <MapActivityContext.Provider
                value={{
                    modeMap: this.state.modeMap,
                    showMap: this.showMap,
                }}>
                {this.props.children}
            </MapActivityContext.Provider>
        );
    }
}

ProvideMapActivity.propTypes = {
    children: PropTypes.element.isRequired,
};

export const MapActivityProvider = ProvideMapActivity;
export const MapActivityConsumer = MapActivityContext.Consumer;
export { MapActivityContext };
