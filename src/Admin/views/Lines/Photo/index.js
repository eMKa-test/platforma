import React from "react";
import * as PropTypes from "prop-types";
import GPSCorrect from "Admin/components/LMaps";
import PhotoTab from "./PhotoTab";

class Photo extends React.Component {
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
                            dateFrom={dateFrom}
                            objectId={currentLine.projectId}
                            lineId={currentLine.id}
                            {...other} />
                    ) : <div style={{ height: "600px" }} />
                }
                <PhotoTab
                    dateFrom={dateFrom}
                    {...other} />
            </React.Fragment>
        );
    }
}

Photo.propTypes = {
    currentLine: PropTypes.object.isRequired,
    dateFrom: PropTypes.string,
};

export default React.memo(Photo);
