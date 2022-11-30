import React from "react";
import * as PropTypes from "prop-types";
import ProgressStatus from "./ProgressStatus";
import ProgressMsg from "./ProgressMsg";
import Button from "../Buttons/Button";
import trashIcon from "../../assets/trash.png";

const LoadInfo = ({
    uploadRun,
    type,
    objectId,
    lineId,
    total,
    dropMode,
    currentLoadDone,
    reUpload,
    percentLoad,
    id,
    attempt,
    progress,
    handleFunc,
    chunksUploadMode,
}) => (
    <div className="agent_info-panel">
        <div className="agent_info-panel-top">
            <Button
                styles={`${(total > 0 && !uploadRun) ? "cleaner" : "cleanerItem"}`}
                disMode={(total > 0 && !uploadRun) ? false : true}
                handleFunc={() => handleFunc(id)}
                classes="body-item_clear-button">
                <span>очистить</span>
                <img src={trashIcon} alt="cancel-icon" />
            </Button>
            <ProgressMsg
                chunksUploadMode={chunksUploadMode}
                dropMode={dropMode}
                uploadRun={uploadRun}
                total={total}
                progress={progress}
                currentLoadDone={currentLoadDone}
                reUpload={reUpload}
                attempt={attempt} />
            <ProgressStatus
                attempt={attempt}
                objectId={objectId}
                lineId={lineId}
                type={type}
                progressCount={progress}
                percentLoad={percentLoad}
                progressTotal={total} />
        </div>
    </div>
);

LoadInfo.propTypes = {
    type: PropTypes.string,
    uploadRun: PropTypes.bool.isRequired,
    reUpload: PropTypes.bool.isRequired,
    currentLoadDone: PropTypes.bool.isRequired,
    objectId: PropTypes.number,
    lineId: PropTypes.number,
    progress: PropTypes.number,
    dropMode: PropTypes.bool.isRequired,
    percentLoad: PropTypes.number,
    attempt: PropTypes.number,
};

export default LoadInfo;
