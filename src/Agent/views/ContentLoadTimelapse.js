import React, { Component } from "react";
import { connect } from "react-redux";
import * as PropTypes from "prop-types";
import UploadItemsTimelapse from "./UploadItemsTimelapse";

class ContentLoadTimelapse extends Component {
    static propTypes = {
        uploadRun: PropTypes.bool.isRequired,
        dropMode: PropTypes.bool.isRequired,
        chunksUploadMode: PropTypes.bool.isRequired,
        timelapseUpload: PropTypes.array,
        handleFileUpload: PropTypes.func,
        changeUploadStatus: PropTypes.func,
        handleCollects: PropTypes.func,
        changeBGHeader: PropTypes.func,
        fetchUploadedTimelapse: PropTypes.func,
        clearLoadContent: PropTypes.func,
        clearItemContentLapse: PropTypes.func,
    };

    componentDidMount() {

    }

    render() {
        const {
            changeUploadStatus, handleCollects, dropMode, uploadRun, changeBGHeader, handleFileUpload, selectDate, timelapseUpload, fetchUploadedTimelapse, clearLoadContent, chunksUploadMode, clearItemContentLapse,
        } = this.props;
        const sumTotal = timelapseUpload.length > 0 ? timelapseUpload[0].content : [];
        return (
            <div
                className="body-item-box_timelapse col-2">
                <UploadItemsTimelapse
                    clearItemContentLapse={clearItemContentLapse}
                    chunksUploadMode={chunksUploadMode}
                    clearLoadContent={clearLoadContent}
                    fetchUploadedTimelapse={fetchUploadedTimelapse}
                    handleCollects={handleCollects}
                    dropMode={dropMode}
                    date={selectDate}
                    uploadRun={uploadRun}
                    totalUpload={timelapseUpload}
                    accept="video/*"
                    type="timelapse"
                    nameItem="Таймлапс"
                    total={timelapseUpload.length > 0 ? timelapseUpload[0].total : 0}
                    content={sumTotal}
                    changeBGHeader={changeBGHeader}
                    handleFileUpload={handleFileUpload}
                    changeUploadStatus={changeUploadStatus} />
            </div>
        );
    }
}

export default connect(
    (state) => ({
        items: state.uploads,
        uuids: state.uploads.map((el) => `${el.object}-${el.line}-${el.type}`),
        totalStore: state.progress,
        selectDate: state.date,
    }),
)(ContentLoadTimelapse);
