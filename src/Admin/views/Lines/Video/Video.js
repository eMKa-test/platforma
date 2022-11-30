import React from "react";
import * as PropTypes from "prop-types";
import { Card, CardBody, Button } from "reactstrap";
import { fetchData } from "api";
import EditModal from "Admin/common/EditModal";
import DeleteModal from "Admin/common/DeleteModal";
import VideoPlayer from "../../../../common/VideoPlayer";

class Video extends React.Component {
    static propTypes = {
        video: PropTypes.object,
        uploadUrl: PropTypes.string,
        contentType: PropTypes.string,
        pagination: PropTypes.object,
        startEditMark: PropTypes.func,
        changeForceMapUpdate: PropTypes.func,
        reloadCalendar: PropTypes.func,
        showMeEditContent: PropTypes.number,
        index: PropTypes.number,
    };

    constructor() {
        super();
        this.state = {
            isOpen: false,
            isOpenDelete: false,
        };
    }

    submitVideo = (ev) => {
        ev.preventDefault();
        ev.persist();
        this.setState({ isOpen: false }, () => {
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
                },
            }).then(({ success = false }) => {
                if (success) {
                    this.props.reloadCalendar("video");
                    this.props.changeForceMapUpdate(true);
                }
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
                this.props.reloadCalendar("video");
            }
        });

        this.setState({ isOpenDelete: false });
    };

    toggleModal = () => this.setState((state) => ({ isOpen: !state.isOpen }));

    toggleDeleteModal = () => this.setState((state) => ({ isOpenDelete: !state.isOpenDelete }));

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
        const { isOpen, isOpenDelete } = this.state;
        let gps = coords;
        if (!gps) {
            gps = {};
        }
        return (
            <React.Fragment>
                <Card
                    className="select-map-preview-item">
                    <CardBody
                        className={`image-thumb image-thumb_video ${showMeEditContent === video.id
                            ? "_active-edit-item" : ""}`}
                        onClick={() => this.activeMarkerPreviewContent(video.id, index, video)}>
                        <VideoPlayer
                            tmb={content.src.tmb && content.src.tmb}
                            className="VideoPreview"
                            src={content.src.src}
                            preload="none" />
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
                <EditModal
                    edit
                    title="Редактирование контента"
                    withName={false}
                    isOpen={isOpen}
                    forContent={false}
                    defaultDescription={content.description}
                    defaultLat={gps.lat}
                    defaultLong={gps.long}
                    defaultDateFrom={content.date}
                    toggleModal={this.toggleModal}
                    submit={this.submitVideo} />
                <DeleteModal
                    isOpen={isOpenDelete}
                    toggleModal={this.toggleDeleteModal}
                    submit={this.deleteContent} />
            </React.Fragment>
        );
    }
}

export default Video;
