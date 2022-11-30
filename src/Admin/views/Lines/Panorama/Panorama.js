import React from "react";
import * as PropTypes from "prop-types";
import { Card, CardBody, Button } from "reactstrap";
import get from "lodash/get";
import has from "lodash/has";
import { fetchData } from "api";
import EditModal from "Admin/common/EditModal";
import DeleteModal from "Admin/common/DeleteModal";

class Panorama extends React.Component {
    static propTypes = {
        showMeEditContent: PropTypes.number,
        image: PropTypes.object,
        uploadUrl: PropTypes.string,
        pagination: PropTypes.object,
        index: PropTypes.number,
        reloadCalendar: PropTypes.func.isRequired,
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
        this.setState({ isOpen: false }, () => {
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
                    this.props.reloadCalendar("panorama")
                    this.props.changeForceMapUpdate(true);
                }
            });
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
                this.setState({ isOpenDelete: false });
                this.props.submitCallback();
                this.props.reloadCalendar("panorama")
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

    onClickThumHandler = (index, image) => {
        if (this.props.switchPanel === "panorama") {
            this.props.changePanId(image.id);
        }
        if (this.props.switchPanel === "map") {
            this.activeMarkerPreviewContent(image.id, index, image);
        }
    }

    render() {
        const {
            image, image: { gps: coords }, index, id, showMeEditContent,
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
                        onClick={() => this.onClickThumHandler(index, image)}
                        className={`
                            image-thumb image-thumb_small admin-panoram-thumb
                            ${(id === image.id || showMeEditContent === image.id) && "admin-panoram-thumb_selected"}
                        `}
                        style={{ backgroundImage: has(image, "src.tmb") ? `url(${get(image, "src.tmb")})` : "none" }} />
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
                <EditModal
                    edit
                    title="Редактирование контента"
                    withName={false}
                    isOpen={isOpen}
                    forContent={false}
                    defaultDescription={image.description}
                    defaultDateFrom={image.date}
                    defaultLat={gps.lat}
                    defaultLong={gps.long}
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

export default Panorama;
