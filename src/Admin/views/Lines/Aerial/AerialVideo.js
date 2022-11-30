import React from "react";
import * as PropTypes from "prop-types";
import { Card, CardBody, Button } from "reactstrap";
import EditModal from "Admin/common/EditModal";
import DeleteModal from "Admin/common/DeleteModal";
import { fetchData } from "api";
import EditVideo from "../../../components/EditVideos";
import VideoPlayer from "../../../../common/VideoPlayer";

class Video extends React.Component {
    static propTypes = {
        video: PropTypes.object,
        uploadUrl: PropTypes.string,
        pagination: PropTypes.object,
        setshowMeEditContent: PropTypes.func,
        showMeEditContent: PropTypes.number,
        index: PropTypes.number,
        reloadCalendar: PropTypes.func.isRequired,
        changeForceMapUpdate: PropTypes.func.isRequired,
        startEditMark: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isOpenDelete: false,
            videoCut: null,
            loadIs: false,
            reFetch: false,
        };
    }

    submitVideo = (ev) => {
        ev.preventDefault();
        ev.persist();
        this.setState({ loadIs: true, isOpen: false }, () => {
            const { video, uploadUrl } = this.props;
            fetchData({
                url: `${uploadUrl}/${video.id}`,
                method: "put",
                body: {
                    ...video,
                    date: ev.target.dateFrom.value,
                    description: ev.target.description.value,
                    gps: {
                        lat: ev.target.lat.value,
                        long: ev.target.long.value,
                    },
                    videocut: this.state.videoCut,
                },
            })
                .then(({ success = false }) => {
                    if (success) {
                        this.setState({ loadIs: false, reFetch: false });
                        this.props.reloadCalendar("aerial");
                        this.props.changeForceMapUpdate(true);
                    }
                })
                .catch(() => {
                    this.setState({ loadIs: false, reFetch: true }, () => {
                        alert("Ошибка. Нажмите Повторить");
                    });
                });
        });
    };

    deleteContent = (ev) => {
        ev.preventDefault();
        ev.persist();
        const { video, uploadUrl } = this.props;
        fetchData({
            url: `${uploadUrl}/${video.id}`,
            method: "delete",
        }).then(({ success = false }) => {
            if (success) {
                this.setState({ isOpenDelete: false });
                this.props.reloadCalendar("aerial");
            }
        });

        this.setState({ isOpenDelete: false });
    };

    toggleModal = () => this.setState((state) => ({ isOpen: !state.isOpen }));

    toggleDeleteModal = () => this.setState((state) => ({ isOpenDelete: !state.isOpenDelete }));

    getVideoCut = (arr) => this.setState({ videoCut: arr });

    activeMarkerPreviewContent = (id, index, marker) => {
        let correctIndex = index;
        if (this.props.pagination.page > 1) {
            correctIndex = index + this.props.pagination.limit * (this.props.pagination.page - 1);
        }
        this.props.startEditMark(id, index, marker, correctIndex);
    };

    render() {
        const {
            video: content, video: { gps: coords }, video, showMeEditContent, index,
        } = this.props;
        const {
            isOpen, isOpenDelete, loadIs, reFetch,
        } = this.state;
        let gps = coords;
        if (!gps) {
            gps = {};
        }
        let alertOutline = {};
        if (video.status !== "ACTIVE") {
            alertOutline = { outline: "4px dashed red" };
        }
        return (
            <React.Fragment>
                <Card
                    className={`select-map-preview-item ${showMeEditContent === video.id ? "_active-edit-item" : ""}`}
                    style={alertOutline}>
                    <CardBody
                        className={`image-thumb image-thumb_video ${showMeEditContent === video.id ? "_active-edit-item" : ""}`}
                        onClick={() => this.activeMarkerPreviewContent(video.id, index, video)}>
                        <VideoPlayer
                            className="VideoPreview"
                            preload="none"
                            tmb={content.src.tmb && content.src.tmb}
                            src={content.src.src} />
                        <Button
                            className="content-edit-description-button"
                            color="light"
                            onClick={this.toggleModal}>
                            <i className="icon-pencil icons d-block" />
                        </Button>
                        <Button
                            className="content-delete-description-button"
                            color="light"
                            onClick={this.toggleDeleteModal}>
                            <i className="icon-trash icons d-block" />
                        </Button>
                        <p className="content-thumb-description">{content.description || ""}</p>
                    </CardBody>
                </Card>
                <EditModal edit
                    title="Редактирование контента"
                    withName={false}
                    loadIs={loadIs}
                    isOpen={isOpen}
                    forContent={false}
                    defaultDescription={content.description}
                    defaultDateFrom={content.date}
                    defaultLat={gps.lat}
                    defaultLong={gps.long}
                    toggleModal={this.toggleModal}
                    submit={this.submitVideo}
                    stylesForAerial={{ maxWidth: "650px" }}
                    reFetch={reFetch}
                    cutVideos={(
                        <EditVideo
                            {...this.props}
                            getVideoCut={this.getVideoCut} />)} />
                <DeleteModal
                    isOpen={isOpenDelete}
                    toggleModal={this.toggleDeleteModal}
                    submit={this.deleteContent} />
            </React.Fragment>
        );
    }
}

export default Video;
