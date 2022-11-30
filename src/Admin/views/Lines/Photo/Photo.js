import React from "react";
import * as PropTypes from "prop-types";
import { Card, CardBody, Button } from "reactstrap";
import get from "lodash/get";
import has from "lodash/has";
import { fetchData } from "api";
import EditModal from "Admin/common/EditModal";
import DeleteModal from "Admin/common/DeleteModal";

class Photo extends React.Component {
    static propTypes = {
        showMeEditContent: PropTypes.number,
        image: PropTypes.object,
        uploadUrl: PropTypes.string,
        previewPosition: PropTypes.string,
        showPreviewPic: PropTypes.bool.isRequired,
        changePreviewPosition: PropTypes.func,
        showMePreviewBox: PropTypes.func,
        pagination: PropTypes.object,
        isOpenPreviwMap: PropTypes.bool,
        index: PropTypes.number,
        changeForceMapUpdate: PropTypes.func,
        reloadCalendar: PropTypes.func,
        startEditMark: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isOpenDelete: false,
        };
    }

    submitImage = (ev) => {
        ev.preventDefault();
        ev.persist();
        const { image, uploadUrl } = this.props;
        fetchData({
            url: `${uploadUrl}/${image.id}`,
            method: "put",
            body: {
                ...image,
                date: ev.target.dateFrom.value,
                description: ev.target.description.value,
                gps: {
                    lat: ev.target.lat.value,
                    long: ev.target.long.value,
                },
            },
        }).then(({ success = false }) => {
            if (success) {
                this.setState({ isOpen: false }, () => {
                    this.props.reloadCalendar("image");
                    this.props.changeForceMapUpdate(true);
                });
            }
        });
    };

    deleteContent = (ev) => {
        ev.preventDefault();
        ev.persist();
        const { image, uploadUrl } = this.props;
        fetchData({
            url: `${uploadUrl}/${image.id}`,
            method: "delete",
        }).then(({ success = false }) => {
            if (success) {
                this.setState({ isOpenDelete: false }, () => {
                    this.props.reloadCalendar("image");
                });
            }
        });
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
            image, image: { gps: coords },
            showMeEditContent, isOpenPreviwMap, index, previewPosition, showPreviewPic,
        } = this.props;
        const { isOpen, isOpenDelete } = this.state;
        let gps = coords;
        if (!gps) {
            gps = {};
        }
        const previewPos = previewPosition === "bottom" ? { bottom: 0 } : { top: 0 };
        return (
            <React.Fragment>
                <Card
                    className="select-map-preview-item">
                    <CardBody
                        className={`image-thumb image-thumb_small ${showMeEditContent === image.id ? "_active-edit-item" : ""}`}
                        onClick={() => this.activeMarkerPreviewContent(image.id, index, image)}
                        style={{ backgroundImage: has(image, "src.tmb") ? `url(${get(image, "src.tmb")})` : "none"}} />
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
                    <p className="content-thumb-description">{image.description || ""}</p>
                </Card>
                {showPreviewPic && (
                    <div
                        style={previewPos}
                        className={`show-marker-image ${showMeEditContent === image.id && isOpenPreviwMap
                            ? "show-preview-map" : "hide-preview-map"}`}>
                        <button
                            type="button"
                            className="close-show-preview"
                            onClick={() => this.props.showMePreviewBox(false)}>
                            X
                        </button>
                        <button
                            type="button"
                            className="select-show-preview-position"
                            onClick={this.props.changePreviewPosition}>
                            {previewPosition === "bottom" ? "Вверх" : "Вниз"}
                        </button>
                        <div
                            className="show-marker-image-box">
                            <img
                                src={image.src.src}
                                alt="Object" />
                        </div>
                    </div>
                )}
                <EditModal
                    edit
                    title="Редактирование контента"
                    withName={false}
                    forContent={false}
                    isOpen={isOpen}
                    defaultDescription={image.description}
                    defaultLat={gps.lat}
                    defaultLong={gps.long}
                    defaultDateFrom={image.date}
                    toggleModal={this.toggleModal}
                    submit={this.submitImage} />
                <DeleteModal
                    isOpen={isOpenDelete}
                    toggleModal={this.toggleDeleteModal}
                    submit={this.deleteContent} />
            </React.Fragment>
        );
    }
}

export default Photo;
