import React from "react";
import * as PropTypes from "prop-types";
import { Badge } from "reactstrap";
import totalIcon from "../../assets/total1.png";
import uploadIcon from "../../assets/uploaded.png";

const renderStatus = ({
    progressCount,
    progressTotal,
    type,
}) => (
    <div className="info-panel_upload-group">
        <p className="info-panel_upload_total">
            <img
                src={totalIcon}
                alt="Total upload" />
            <Badge color="light">
                {progressTotal}
            </Badge>
        </p>
        <p className="info-panel_upload_progress">
            <img
                src={uploadIcon}
                alt="Upload upload" />
            <Badge color="light">
                {progressCount}
            </Badge>
        </p>
    </div>
);

const ProgressStatus = (props) => (
    <React.Fragment>
        {renderStatus(props)}
    </React.Fragment>
);

renderStatus.propTypes = {
    progressCount: PropTypes.number,
    progressTotal: PropTypes.number,
    type: PropTypes.number,
};


export default ProgressStatus;
