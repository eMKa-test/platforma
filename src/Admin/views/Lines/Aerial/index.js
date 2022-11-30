import React from "react";
import * as PropTypes from "prop-types";
import AerialTab from "./AerialTab";
import GPSCorrect from "../../../components/LMaps/LMaps";

class Aerial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { currentLine, dateFrom, ...other } = this.props;
        return (
            <>
                {
                    dateFrom ? (
                        <GPSCorrect
                            dateFrom={dateFrom}
                            objectId={currentLine.projectId}
                            lineId={currentLine.id}
                            {...other} />
                    ) : <div style={{ height: "600px" }} />
                }
                <AerialTab
                    dateFrom={dateFrom}
                    {...other} />
            </>
        );
    }
}

Aerial.propTypes = {
    currentLine: PropTypes.object.isRequired,
    dateFrom: PropTypes.string,
};


export default Aerial;
