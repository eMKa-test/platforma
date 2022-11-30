import React from "react";
import * as PropTypes from "prop-types";
import VideoPlayer from "../../../../common/VideoPlayer";

const renderContent = (currentContentEdit) => {
    switch (currentContentEdit.type) {
        case "VIDEO":
            return (
                <VideoPlayer
                    tmb={currentContentEdit.src.tmb && currentContentEdit.src.tmb}
                    style={{ width: "100%" }}
                    src={currentContentEdit.src.src} />
            );
        case "IMAGE":
            return (
                <img
                    className="preview__current_content_edit"
                    style={{ width: "100%" }}
                    src={currentContentEdit.src.src}
                    alt="content" />
            );
        default: return null;
    }
};

const ContentBox = ({ currentContentEdit }) => {
    if (!currentContentEdit) {
        return null;
    }
    return (
        <div
            className="panorama-correct-content-container">
            {renderContent(currentContentEdit)}
        </div>
    );
};

ContentBox.propTypes = {
    currentContentEdit: PropTypes.object,
};

export default ContentBox;
