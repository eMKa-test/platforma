import React from "react";
import * as PropTypes from "prop-types";
import {
    Card, CardBody, Button,
} from "reactstrap";
import classNames from "classnames";
import get from "lodash/get";
import has from "lodash/has";
import { fetchData } from "api";

import EditModal from "Admin/common/EditModal";
import DeleteModal from "Admin/common/DeleteModal";

class AeroPanorama extends React.Component {
    static propTypes = {
        reloadCalendar: PropTypes.func,
        pan: PropTypes.object,
        uploadUrl: PropTypes.string,
        submitCallback: PropTypes.func,
        currentAeropanForEdit: PropTypes.object,
        setCurrentAeropanForEdit: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isOpenDelete: false,
        };
    }

    submitPan = (ev) => {
        ev.preventDefault();
        ev.persist();
        this.setState({ isOpen: false }, () => {
            const { pan, uploadUrl } = this.props;
            fetchData({
                url: `${uploadUrl}/${pan.id}`,
                method: "put",
                body: {
                    ...pan,
                    date: ev.target.dateFrom.value,
                    description: ev.target.description.value,
                    gps: {
                        lat: ev.target.lat.value,
                        long: ev.target.long.value,
                    },
                },
            }).then(({ success = false }) => {
                if (success) {
                    this.props.reloadCalendar("aeropanorama");
                }
            });
        });
    };

    deleteContent = (ev) => {
        ev.preventDefault();
        ev.persist();
        const { pan, uploadUrl } = this.props;
        fetchData({
            url: `${uploadUrl}/${pan.id}`,
            method: "delete",
        }).then(({ success = false }) => {
            if (success) {
                this.setState({ isOpenDelete: false });
                this.props.reloadCalendar("aeropanorama");
            }
        });
        this.setState({ isOpenDelete: false });
    };

    toggleModal = () => this.setState((state) => ({ isOpen: !state.isOpen }));

    toggleDeleteModal = () => this.setState((state) => ({ isOpenDelete: !state.isOpenDelete }));

    render() {
        const {
            pan, pan: { gps: coords },
            currentAeropanForEdit,
            setCurrentAeropanForEdit,
        } = this.props;
        const { isOpen, isOpenDelete } = this.state;
        let gps = coords;
        if (!gps) {
            gps = {};
        }
        return (
            <React.Fragment>
                <Card
                    className="aeropanorama-tab__select-item">
                    <CardBody
                        onClick={() => setCurrentAeropanForEdit(pan)}
                        className={classNames(
                            "image-thumb image-thumb_small",
                            {
                                "image-thumb_selected": currentAeropanForEdit && currentAeropanForEdit.id === pan.id,
                            },
                        )}
                        style={{ backgroundImage: has(pan, "src.tmb") ? `url(${get(pan, "src.tmb")})` : "none" }} />
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
                    <p className="content-thumb-description">{pan.description || ""}</p>
                </Card>
                <EditModal
                    edit
                    title="Редактирование контента"
                    withName={false}
                    isOpen={isOpen}
                    forContent={false}
                    defaultDescription={pan.description}
                    defaultDateFrom={pan.date}
                    defaultLat={gps.lat}
                    defaultLong={gps.long}
                    toggleModal={this.toggleModal}
                    submit={this.submitPan} />
                <DeleteModal
                    isOpen={isOpenDelete}
                    toggleModal={this.toggleDeleteModal}
                    submit={this.deleteContent} />
            </React.Fragment>
        );
    }
}

export default AeroPanorama;
