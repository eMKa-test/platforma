import React, { Component } from "react";
import { connect } from "react-redux";
import * as PropTypes from "prop-types";
import UploadItemsStream from "./UploadItemsStream";

class ContentLoadStream extends Component {
    static propTypes = {
        uploadRun: PropTypes.bool.isRequired,
        dropMode: PropTypes.bool.isRequired,
        chunksUploadMode: PropTypes.bool.isRequired,
        streamUpload: PropTypes.array,
        handleFileUpload: PropTypes.func,
        changeUploadStatus: PropTypes.func,
        handleCollects: PropTypes.func,
        changeBGHeader: PropTypes.func,
        fetchUploadedStream: PropTypes.func,
        clearLoadContent: PropTypes.func,
        clearItemContentStream: PropTypes.func,
    };

    componentDidMount() {

    }

    render() {
        const {
            changeUploadStatus, handleCollects, dropMode, uploadRun, changeBGHeader, handleFileUpload, selectDate, streamUpload, fetchUploadedStream, clearLoadContent, chunksUploadMode, clearItemContentStream,
        } = this.props;
        const sumTotal = streamUpload.length > 0 ? streamUpload[0].content : [];
        return (
            <div
                className="body-item-box_stream col-2">
                <UploadItemsStream
                    clearItemContentStream={clearItemContentStream}
                    chunksUploadMode={chunksUploadMode}
                    clearLoadContent={clearLoadContent}
                    fetchUploadedStream={fetchUploadedStream}
                    handleCollects={handleCollects}
                    dropMode={dropMode}
                    date={selectDate}
                    uploadRun={uploadRun}
                    totalUpload={streamUpload}
                    accept="video/*"
                    type="stream"
                    nameItem="Стрим"
                    total={streamUpload.length > 0 ? streamUpload[0].total : 0}
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
)(ContentLoadStream);
