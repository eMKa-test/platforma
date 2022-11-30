import React from "react";
import * as PropTypes from "prop-types";
import map from "lodash/map";
import { withRouter, Prompt } from "react-router-dom";
import Dropzone from "react-dropzone";
import { Col, Row, Card, CardBody } from "reactstrap";
import Pagination from "Admin/layout/DefaultPagination";
import VideoPreview from "./VideoPreview";
import Video from "./AerialVideo";

class VideoTab extends React.Component {
    static propTypes = {
        uploadUrl: PropTypes.string.isRequired,
        dateFrom: PropTypes.string,
        reloadCalendar: PropTypes.func,
        changeForceMapUpdate: PropTypes.func,
        setLimitPage: PropTypes.func,
        showMeEditContent: PropTypes.number,
        showPage: PropTypes.number,
        limit: PropTypes.number,
        setshowMeEditContent: PropTypes.func,
    };

    constructor(props) {
        super(props);
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
            this.props.reloadCalendar("aerial");
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
            sm="6"
            md="4"
            xl="3">
            <VideoPreview
                index={file.index}
                file={file.src}
                uploadUrl={this.props.uploadUrl}
                handleDone={this.handleDone} />
        </Col>
    ));

    renderNoneVideos = () => (<p>Видео отсутствует</p>);

    renderVideos = () => map(this.props.content, (video, i) => (
        <Col
            key={video.id || i}
            xs="12"
            sm="6"
            md="4"
            xl="3">
            <Video
                {...this.props}
                video={video}
                index={i}
                pagination={this.props.pagination} />
        </Col>
    ));

    render() {
        const { upload } = this.state;
        const { pagination, total, content: videos, handlePagination } = this.props;
        return (
            <React.Fragment>
                {this.props.children}
                <Row className="mt-3">
                    <Col
                        xs="12"
                        sm="6"
                        md="4"
                        xl="3">
                        <Card>
                            <CardBody className="image-thumb image-thumb_video cursor-pointer">
                                <Dropzone
                                    className="imageUpload"
                                    activeClassName="imageUpload--active"
                                    acceptClassName="imageUpload--accept"
                                    rejectClassName="imageUpload--reject"
                                    accept="video/*"
                                    onDrop={this.handleFileUpload}>
                                    <span>Зона загрузки файла</span>
                                </Dropzone>
                            </CardBody>
                        </Card>
                    </Col>
                    {this.renderPreview()}
                    { videos.length > 0 ? this.renderVideos() : this.renderNoneVideos()}
                </Row>
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

export default withRouter(VideoTab);
