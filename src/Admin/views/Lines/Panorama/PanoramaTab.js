import React from "react";
import * as PropTypes from "prop-types";
import map from "lodash/map";
import { withRouter, Prompt } from "react-router-dom";
import Dropzone from "react-dropzone";
import { Col, Row, Card, CardBody } from "reactstrap";
import Pagination from "Admin/layout/DefaultPagination";
import Preview from "./Preview";
import Panorama from "./Panorama";
import PanoramPreview from "../../../components/Panoram";

class PanoramaTab extends React.Component {
    static propTypes = {
        uploadUrl: PropTypes.string.isRequired,
        dateFrom: PropTypes.string,
        startEditMark: PropTypes.func,
        reloadCalendar: PropTypes.func,
        changeForceMapUpdate: PropTypes.func,
        showMePreview: PropTypes.func,
        showMePreviewBox: PropTypes.func,
        setLimitPage: PropTypes.func,
        setshowMeEditContent: PropTypes.func,
        showMeEditContent: PropTypes.number,
        limit: PropTypes.number,
        showPage: PropTypes.number,
        isOpenPreviwMap: PropTypes.bool,
        showPreviewPic: PropTypes.bool,
        shiftKey: PropTypes.bool,
        children: PropTypes.element,
        pans: PropTypes.array.isRequired,
    };

    constructor() {
        super();
        this.state = {
            upload: {},
        };
    }

    inProgress = (upload) => Object.keys(upload).filter((i) => typeof upload[i] !== "undefined").length;

    handleDone = (index) => {
        const { upload } = this.state;
        upload[index] = undefined;
        if (this.inProgress(upload) !== 0) {
            return;
        }
        this.setState(() => ({ upload: {} }), () => {
            this.props.reloadCalendar("panorama");
        });
    };

    handleFileUpload = (acceptedFiles) => {
        if (this.inProgress(this.state.upload) !== 0) {
            return alert("Предыдущая загрузка файлов в процессе"); // eslint-disable-line
        }
        return this.setState({
            upload: acceptedFiles.reduce((acc, file, i) => {
                acc[i] = { index: i, src: file };
                return acc;
            }, {}),
        });
    };

    renderPreview = () => map(this.state.upload, (file) => (
        <Col
            key={file.index}
            xs="12"
            md="6"
            xl="4">
            <Preview
                index={file.index}
                file={file.src}
                uploadUrl={this.props.uploadUrl}
                handleDone={this.handleDone} />
        </Col>
    ));

    renderImages = () => map(this.props.pans, (image, i) => (
        <Col
            key={image.id || i}
            xs="12"
            md="6"
            xl="4">
            <Panorama
                {...this.props}
                image={image}
                index={i}
                pagination={this.props.pagination}
                previewPosition={this.state.previewPosition} />
        </Col>
    ));

    render() {
        const { upload } = this.state;
        const {
            showMeEditContent, pagination, total, showPreviewPic,
            isOpenPreviwMap, handlePagination, pans,
        } = this.props;
        return (
            <React.Fragment>
                {this.props.children}
                <Row className="mt-3">
                    <Col
                        xs="12"
                        md="6"
                        xl="4">
                        <Card>
                            <CardBody className="image-thumb image-thumb_small cursor-pointer">
                                <Dropzone
                                    className="imageUpload"
                                    activeClassName="imageUpload--active"
                                    acceptClassName="imageUpload--accept"
                                    rejectClassName="imageUpload--reject"
                                    accept="image/*"
                                    onDrop={this.handleFileUpload}>
                                    <p>Зона загрузки файла</p>
                                </Dropzone>
                            </CardBody>
                        </Card>
                    </Col>
                    {this.renderPreview()}
                    {pans && pans.length
                        ? this.renderImages()
                        : <p>Ни одной панорамы за выбранную дату не найдено, попробуйте выбрать другую дату</p>
                    }
                </Row>
                {showPreviewPic && showMeEditContent && (
                    <div
                        className={`show-marker-panoram ${pans
                            .some((pan) => showMeEditContent === pan.id) && isOpenPreviwMap
                            ? "show-preview-map"
                            : "hide-preview-map"}`}>
                        <button
                            type="button"
                            className="close-show-preview_panoram"
                            onClick={() => this.props.showMePreviewBox(false)}>
                            +
                        </button>
                        <div
                            className="show-marker-panorama-box">
                            <PanoramPreview
                                showMeEditContent={showMeEditContent}
                                panorama={pans.map((pan) => pan)
                                    .filter((pan) => pan.id === showMeEditContent)[0]} />
                        </div>
                    </div>
                )}
                <Pagination
                    total={total}
                    onPagination={handlePagination}
                    pagination={pagination} />
                <Prompt
                    when={Object.entries(upload).length > 0}
                    message={() => "Вы прервете загрузку файлов, Вы уверены?"} />
            </React.Fragment>
        );
    }
}

export default withRouter(PanoramaTab);
