import React from "react";
import * as PropTypes from "prop-types";

const Loader = React.createContext({
    progress: null,
    loaded: false,
    contentData: null,
});

class LoaderProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: null,
            loaded: false,
            contentData: null,
        };
    }

    setContentLoaded = (loaded) => {
        this.setState({ loaded });
    };

    setContentProgress = (progress) => {
        this.setState({ progress });
    };

    setContentData = (contentData) => {
        this.setState({ contentData });
    };

    render() {
        return (
            <Loader.Provider
                value={{
                    ...this.state,
                    setContentLoaded: this.setContentLoaded,
                    setContentProgress: this.setContentProgress,
                    setContentData: this.setContentData,
                }}>
                {this.props.children}
            </Loader.Provider>
        );
    }
}

LoaderProvider.propTypes = {
    children: PropTypes.element.isRequired,
};

const LoaderConsumer = Loader.Consumer;

export { LoaderConsumer, LoaderProvider };
