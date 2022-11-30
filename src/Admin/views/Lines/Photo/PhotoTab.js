import React from "react";
import * as PropTypes from "prop-types";
import map from "lodash/map";
import { withRouter, Prompt } from "react-router-dom";
import Dropzone from "react-dropzone";
import {
    Col, Row, Card, CardBody,
} from "reactstrap";
import Pagination from "Admin/layout/DefaultPagination";
import Preview from "./Preview";
import Photo from "./Photo";

class PhotoTab extends React.PureComponent {
    static propTypes = {
        uploadUrl: PropTypes.string.isRequired,
        dateFrom: PropTypes.string,
        reloadCalendar: PropTypes.func,
        showMePreview: PropTypes.func,
        setLimitPage: PropTypes.func,
        setshowMeEditContent: PropTypes.func,
        changeForceMapUpdate: PropTypes.func,
        startEditMark: PropTypes.func,
        showMePreviewBox: PropTypes.func,
        showMeEditContent: PropTypes.number,
        limit: PropTypes.number,
        showPage: PropTypes.number,
        isOpenPreviwMap: PropTypes.bool,
        showPreviewPic: PropTypes.bool,
        content: PropTypes.array,
        pagination: PropTypes.object.isRequired,
        total: PropTypes.number.isRequired,
        handlePagination: PropTypes.func.isRequired,
        children: PropTypes.element,
    };

    constructor() {
        super();
        this.state = {
            upload: {},
            previewPosition: "bottom",
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
            this.props.reloadCalendar("image");
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

    changePreviewPosition = () => {
        this.setState((state) => (
            { previewPosition: state.previewPosition === "bottom" ? "top" : "bottom" }
        ));
    };

    renderPreview = () => map(this.state.upload, (file) => (
        <Col
            key={file.index}
            xs="12"
            sm="6"
            md="4"
            xl="3">
            <Preview
                index={file.index}
                file={file.src}
                uploadUrl={this.props.uploadUrl}
                handleDone={this.handleDone} />
        </Col>
    ));

    renderImages = () => map(this.props.content, (image, i) => (
        <Col
            key={image.id || i}
            xs="12"
            sm="6"
            md="4"
            xl="3">
            <Photo
                image={image}
                index={i}
                {...this.props}
                pagination={this.props.pagination}
                previewPosition={this.state.previewPosition}
                changePreviewPosition={this.changePreviewPosition} />
        </Col>
    ));

    render() {
        const { upload } = this.state;
        const { pagination, total, handlePagination } = this.props;
        return (
            <div style={{ height: "100%" }}>
                {this.props.children}
                <Row className="mt-3">
                    <Col
                        xs="12"
                        sm="6"
                        md="4"
                        xl="3">
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
                    {this.renderImages()}
                </Row>
                <Pagination
                    total={total}
                    onPagination={handlePagination}
                    pagination={pagination} />
                <Prompt
                    when={Object.entries(upload).length > 0}
                    message={() => "Вы прервете загрузку файлов, Вы уверены?"} />
            </div>
        );
    }
}

export default withRouter(PhotoTab);
