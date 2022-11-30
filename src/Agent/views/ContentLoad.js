import React, { Component } from "react";
import { connect } from "react-redux";
import UploadItems from "./UploadItems";
import { CONTENT_CATEGORY, setAlternativeName } from "../constants";


class ContentLoad extends Component {
    componentDidMount() {
        this.props.disactiveDate(true);
    }

    renderItems = (
        obId, linId, uploadRun, dropMode, objectName, lineName, {
            handleFileUpload, changeUploadStatus, selectItems, newUploadRun, handleCollects,
            changeBGHeader, clearLoadContent, toggleModal, chunksUploadMode, clearItemContent,
        },
    ) => (
        CONTENT_CATEGORY(obId, linId).map((item) => {
            const uuid = `${obId}-${linId}-${item.type}`;
            let setTotal = 0;
            if (dropMode) {
                const doneIt = selectItems.uuid.findIndex((id) => uuid === id);
                setTotal = doneIt >= 0 ? selectItems.total[doneIt] : 0;
            }
            if (this.props.uuids.includes(uuid)) {
                return this.props.items.map((count, k) => {
                    if (this.props.uuids[k] === uuid) {
                        return (
                            <React.Fragment
                                key={uuid}>
                                <div
                                    className="body-item-box col-12">
                                    <UploadItems
                                        {...this.props.items[k]}
                                        chunksUploadMode={chunksUploadMode}
                                        toggleModal={toggleModal}
                                        clearLoadContent={clearLoadContent}
                                        newUploadRun={newUploadRun}
                                        handleCollects={handleCollects}
                                        dropMode={dropMode}
                                        date={this.props.selectDate}
                                        objectName={objectName}
                                        lineName={lineName}
                                        id={uuid}
                                        uploadRun={uploadRun}
                                        total={setTotal}
                                        nameItem={item.name}
                                        accept={item.accept}
                                        type={item.type}
                                        objectId={obId}
                                        lineId={linId}
                                        changeBGHeader={changeBGHeader}
                                        handleFileUpload={handleFileUpload}
                                        changeUploadStatus={changeUploadStatus} />
                                </div>
                            </React.Fragment>);
                    }
                });
            }
            return (
                <React.Fragment
                    key={uuid}>
                    <div
                        className="body-item-box col-12">
                        <UploadItems
                            clearItemContent={clearItemContent}
                            chunksUploadMode={chunksUploadMode}
                            toggleModal={toggleModal}
                            clearLoadContent={clearLoadContent}
                            newUploadRun={newUploadRun}
                            handleCollects={handleCollects}
                            date={this.props.selectDate}
                            dropMode={dropMode}
                            id={uuid}
                            uploadRun={uploadRun}
                            objectName={objectName}
                            lineName={lineName}
                            total={setTotal}
                            nameItem={item.name}
                            accept={item.accept}
                            type={item.type}
                            objectId={obId}
                            lineId={linId}
                            changeBGHeader={changeBGHeader}
                            handleFileUpload={handleFileUpload}
                            changeUploadStatus={changeUploadStatus} />
                    </div>
                </React.Fragment>
            );
        })
    )

    renderUploadGrid = ({ objects, uploadRun, dropMode }) => (
        objects.map((el) => (
            <div className="agent__object-container" key={el.id}>
                <p className="agent-object-name mb-0">
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`objects/${el.id}`}>
                        {el.name}
                    </a>
                </p>
                <div className="line__container row no-gutters">
                    {
                        el.lines.map((line) => (
                            <div
                                className="agent-line-container col-auto"
                                key={line.id}>
                                <p className="agent-line-name mb-0">
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={`objects/${el.id}/${line.id}/0`}>
                                        {line.name}
                                        {setAlternativeName(el.id, line.id)}
                                    </a>
                                </p>
                                <div className="d-flex flex-column justify-content-around">
                                    {
                                        this.renderItems(el.id, line.id, uploadRun, dropMode, el.name, line.name, this.props)
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        ))
    );

    render() {
        return (
            <React.Fragment>
                {this.renderUploadGrid(this.props)}
            </React.Fragment>
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
)(ContentLoad);
