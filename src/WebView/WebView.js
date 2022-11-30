import React from "react";
import * as PropTypes from "prop-types";
import AeroPanorama from "../PanoramaAero";

class App extends React.Component {
    constructor() {
        super();
        window.aeroWvOnMount = this.aeroWvOnMount;
        this.state = {
            contentID: null,
            panoramas: [],
            aeropanoramas: [],
        };
    }

    componentDidMount() {
        if (typeof this.props.onMount === "function") {
            this.props.onMount();
        }
    }

    aeroWvOnMount = (panoramas, aeropanoramas) => {
        try {
            panoramas = JSON.parse(panoramas, );
            aeropanoramas = JSON.parse(aeropanoramas);
        } catch (e) {
            console.error("Argument json parse error in aeroWvOnMount", e.message);
        }
        const contentID = aeropanoramas.length > 0 ? aeropanoramas[0].id : 0;
        this.setState({
            panoramas,
            aeropanoramas,
            contentID,
        });
    };

    changeContentID = (contentID) => this.setState({ contentID });

    render() {
        const { contentID, panoramas, aeropanoramas } = this.state;
        return (
            <AeroPanorama
                webview
                changeContentID={this.changeContentID}
                aeropanoramas={aeropanoramas}
                sublines={panoramas}
                contentID={contentID}
            />
        );
    }
}

App.propTypes = {
    onMount: PropTypes.func,
};

export default App;
