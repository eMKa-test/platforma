import React from "react";
import * as PropTypes from "prop-types";
import VideoTab from "./VideoTab";
import GPSCorrect from "../../../components/LMaps/LMaps";

class Video extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { currentLine, dateFrom, ...other } = this.props;
        return (
            <React.Fragment>
                {
                    dateFrom ? (
                        <GPSCorrect
                            objectId={currentLine.projectId}
                            lineId={currentLine.id}
                            dateFrom={dateFrom}
                            {...other} />
                    ) : <div style={{ height: "600px" }} />
                }
                <VideoTab
                    dateFrom={dateFrom}
                    {...other} />
            </React.Fragment>
        );
    }
}

Video.propTypes = {
    currentLine: PropTypes.object.isRequired,
    dateFrom: PropTypes.string,
};

export default Video;
