import React from "react";
import * as PropTypes from "prop-types";
import { Badge } from "reactstrap";
import doneIcon from "../../assets/done.png";
import errorIcon from "../../assets/error.png";

const ProgressMsg = ({
    dropMode,
    uploadRun,
    total,
    currentLoadDone,
    reUpload,
    chunksUploadMode,
    attempt,
}) => {
    if (!reUpload) {
        return (
            <React.Fragment>
                {(uploadRun && currentLoadDone && dropMode && total > 0) && (
                    <span
                        className="agent_info-msg alert alert-success mb-1 mt-1"
                        role="alert">
                        <img
                            src={doneIcon}
                            alt="Done upload icon" />
                    </span>
                )}
            </React.Fragment>
        );
    }
    if (chunksUploadMode && attempt >= 3) {
        return (
            <React.Fragment>
                {(uploadRun && currentLoadDone && dropMode && total > 0) && (
                    <span
                        className="agent_info-msg alert alert-success mb-1 mt-1"
                        role="alert">
                        <img
                            src={doneIcon}
                            alt="Done upload icon" />
                    </span>
                )}
            </React.Fragment>
        );
    }
    return (
        <React.Fragment>
            <span
                className="agent_info-msg alert alert-danger"
                role="alert">
                <img
                    src={errorIcon}
                    alt="Error upload icon" />
            </span>
            <div className="agent_info-error-wrap">
                <Badge
                    className={`agent_info-error-attempt ${attempt > 0 ? "show_attempt" : "hide_attempt"}`}
                    color="danger">
                    попытка:
                    {" "}
                    {attempt}
                </Badge>
            </div>
        </React.Fragment>
    );
};

ProgressMsg.propTypes = {
    uploadRun: PropTypes.bool.isRequired,
    chunksUploadMode: PropTypes.bool.isRequired,
    currentLoadDone: PropTypes.bool.isRequired,
    reUpload: PropTypes.bool.isRequired,
    dropMode: PropTypes.bool.isRequired,
    total: PropTypes.number,
    attempt: PropTypes.number,
};

export default ProgressMsg;
