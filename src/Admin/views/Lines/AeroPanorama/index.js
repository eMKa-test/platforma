import React from "react";
import * as PropTypes from "prop-types";
import AeroPanoramaTab from "./AeroPanoramaTab";
import AeroCreatePanorama from "../../../components/AeroCreatePanorama";

class Aero extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentAeropanForEdit: null,
            aeroPansCount: 0,
        };
    }

    componentDidUpdate() {
        if (this.props.content.length !== this.state.aeroPansCount) {
            this.addedPanoramas(this.props.content.length);
        }
    }

    setCurrentAeropanForEdit = (val) => this.setState({ currentAeropanForEdit: val });

    addedPanoramas = (val) => {
        this.setState({
            aeroPansCount: val,
        });
    };

    render() {
        const { currentLine, dateFrom, ...other } = this.props;
        return (
            <React.Fragment>
                <AeroCreatePanorama
                    {...other}
                    {...this.state}
                    dateFrom={dateFrom}
                    setCurrentAeropanForEdit={this.setCurrentAeropanForEdit}
                    params={currentLine} />
                <AeroPanoramaTab
                    {...other}
                    {...this.state}
                    dateFrom={dateFrom}
                    currentLine={currentLine}
                    addedPanoramas={this.addedPanoramas}
                    setCurrentAeropanForEdit={this.setCurrentAeropanForEdit} />
            </React.Fragment>
        );
    }
}

Aero.propTypes = {
    dateFrom: PropTypes.string,
    currentLine: PropTypes.object.isRequired,
    content: PropTypes.array.isRequired,
};

export default Aero;
