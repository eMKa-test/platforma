import React from "react";
import * as PropTypes from "prop-types";
import {
    Card, CardBody, Col, Row,
} from "reactstrap";

import Dropzone from "react-dropzone";
import map from "lodash/map";
import PromoPreview from "./PromoPreview";
import PromoVideo from "./PromoVideoContainer";

function getPromoWithDate(promos, date) {
    return promos.filter((promo) => promo.date === moment(date).format("YYYY-MM-DD"));
}

class PromoVideoTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            upload: {},
        };
    }

    componentDidMount() {
    }

    handleDone = (index) => {
        const { upload } = this.state;
        upload[index] = undefined;
        if (this.inProgress(upload) !== 0) {
            return;
        }
        this.setState({ upload: {} }, () => this.props.setCompany(this.props));
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

    inProgress = (upload) => Object.keys(upload).filter((i) => typeof upload[i] !== "undefined").length;

    renderVideos = (videos) => {
        const getVideos = map(videos, (video, i) => (
            <Col
                key={video.id || i}
                xs="12"
                sm="6"
                md="4"
                xl="3">
                <PromoVideo
                    {...this.props}
                    video={video}
                    index={i} />
            </Col>
        ));
        const getNoteVideos = <p>Видео на данную дату не найдено</p>;
        if (videos.length > 0) {
            return getVideos;
        }
        return getNoteVideos;
    };

    renderPreview = (currentCompany, section) => map(this.state.upload, (file) => (
        <Col
            key={file.index}
            xs="12"
            sm="6"
            md="4"
            xl="3">
            <PromoPreview
                currentCompany={currentCompany}
                section={section}
                index={file.index}
                file={file.src}
                handleDone={this.handleDone} />
        </Col>
    ));

    render() {
        const {
            currentCompany,
            section,
            promo,
            dateFrom,
        } = this.props;
        let videos = promo.content;
        if (section === "promo") {
            videos = getPromoWithDate(promo.content, dateFrom);
        }
        return (
            <React.Fragment>
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
                    {this.renderVideos(videos)}
                    {this.renderPreview(currentCompany, section)}
                </Row>
            </React.Fragment>
        );
    }
}

PromoVideoTab.propTypes = {
    setCompany: PropTypes.func.isRequired,
    currentCompany: PropTypes.object.isRequired,
    section: PropTypes.string,
    promo: PropTypes.object.isRequired,
    dateFrom: PropTypes.string.isRequired,
};

export default PromoVideoTab;
