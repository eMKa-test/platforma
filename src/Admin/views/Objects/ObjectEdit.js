import React from "react";
import * as PropTypes from "prop-types";
import get from "lodash/get";
import { matchPath } from "react-router-dom";
import { Button } from "reactstrap";

import { fetchData } from "api";

import LinesEditModal from "Admin/common/LinesEditModal";
import Header from "Admin/common/Header";
import ObjectEditModal from "Admin/common/ObjectEditModal";
import DeleteModal from "Admin/common/DeleteModal";

import LinesGrid from "./LinesGrid";

class ObjectEdit extends React.Component {
    static propTypes = {
        currentObject: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string,
            image: PropTypes.object,
            gps: PropTypes.shape({
                lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
                long: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            }),
        }).isRequired,
        getObjectByID: PropTypes.func.isRequired,
        putObject: PropTypes.func.isRequired,
        putLine: PropTypes.func.isRequired,
        clearMemory: PropTypes.func.isRequired,
        companies: PropTypes.array.isRequired,
    };

    state = {
        isOpen: false,
        isNewLine: false,
        isOpenDelete: false,
        selectDelLine: null,
        accessCompanies: [],
        currentType: false,
    };

    componentDidMount() {
        this.freshObjectData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const nextID = get(this.props, "match.params.id", -1);
        const prevID = get(prevProps, "match.params.id", -1);
        if (nextID !== prevID) {
            this.props.getObjectByID(nextID);
        }
    }

    componentWillUnmount() {
        this.props.clearMemory();
    }

    freshObjectData = () => {
        const { params } = matchPath(get(this.props, "location.pathname"), {
            path: ["/admin/objects/:objectID", "/admin/companies/:companyID/:objectID"],
        });
        const companyType = params.companyID || false;
        this.props.getObjectByID(params.objectID || -1, companyType);
        this.setState({
            currentType: companyType,
        });
    };

    setAccessCompanies = (val) => this.setState({ accessCompanies: val });

    submitObject = (ev) => {
        ev.preventDefault();
        ev.persist();
        if (ev.target.name.value !== "" && ev.target.description.value !== "") {
            this.setState({ isOpen: false }, () => {
                this.props.putObject({
                    object: {
                        id: this.props.currentObject.id,
                        name: ev.target.name.value,
                        description: ev.target.description.value,
                        gps: {
                            lat: ev.target.lat.value,
                            long: ev.target.long.value,
                        },
                        orderWeight: ev.target.orderWeight.value,
                        auditRatio: Number(ev.target.auditRatio.value),
                        companies: this.state.accessCompanies,
                    },
                });
                this.setAccessCompanies([]);
            });
        }
    };

    toggleModal = () => this.setState((prevState) => ({ isOpen: !prevState.isOpen }));

    toggleLineModal = () => this.setState((prevState) => ({ isNewLine: !prevState.isNewLine }));

    submitNewLine = (ev) => {
        ev.preventDefault();
        ev.persist();
        if (ev.target.name.value && ev.target.description.value) {
            this.setState({ isNewLine: false }, () => this.props.putLine({
                objectID: this.props.currentObject.id,
                line: {
                    name: ev.target.name.value,
                    description: ev.target.description.value,
                    gps: {
                        lat: ev.target.lat.value,
                        long: ev.target.long.value,
                    },
                    agentPlans: {
                        points: ev.target.planPoints.value,
                        photos: ev.target.planPhotos.value,
                        videos: ev.target.planVideos.value,
                        panoramas: ev.target.planPanoramas.value,
                    },
                    orderWeight: ev.target.orderWeight.value,
                },
            }));
        }
    };

    deleteLine = (ev) => {
        ev.preventDefault();
        const { currentObject } = this.props;
        const { selectDelLine } = this.state;
        fetchData({
            url: `/admin/api/projects/${currentObject.id}/lines/${selectDelLine}`,
            method: "delete",
        }).then(({ success = false }) => {
            this.props.getObjectByID(currentObject.id);
            if (success) {
                this.setState({ isOpenDelete: false });
            }
        });
        this.setState({ isOpenDelete: false });
    };

    toggleDeleteModal = (i) => this.setState({ isOpenDelete: !this.state.isOpenDelete, selectDelLine: i });

    render() {
        const { currentObject, companies } = this.props;
        let { gps } = currentObject;
        if (!gps) gps = { lat: "", long: "" };
        const {
            isOpen, isNewLine, isOpenDelete, currentType,
        } = this.state;
        return (
            <React.Fragment>
                <Header
                    onClickEdit={this.toggleModal}
                    title={currentObject.name}
                    description={currentObject.description}
                    image={currentObject.image}
                    uploadUrl={`/admin/api/projects/${currentObject.id}/upload/`} />
                <Button
                    color="primary"
                    onClick={this.toggleLineModal}>
                    Добавить новый отрезок +
                </Button>
                <LinesGrid
                    currentType={Number(currentType)}
                    objectID={currentObject.id}
                    lines={currentObject.lines}
                    toggleDeleteModal={(i) => this.toggleDeleteModal(i)} />
                {
                    isOpen && (
                        <ObjectEditModal
                            {...this.state}
                            setAccessCompanies={this.setAccessCompanies}
                            companies={companies}
                            isOpen={isOpen}
                            project={currentObject}
                            defaultOrderWeight={currentObject.orderWeight}
                            defaultName={currentObject.name}
                            defaultDescription={currentObject.description}
                            defaultLat={gps.lat}
                            defaultLong={gps.long}
                            defaultAuditRatio={currentObject.auditRatio}
                            toggleModal={this.toggleModal}
                            submit={this.submitObject} />
                    )
                }
                <LinesEditModal
                    isOpen={isNewLine}
                    title={`Добавление отрезка объекту - ${currentObject.name}`}
                    toggleModal={this.toggleLineModal}
                    submit={this.submitNewLine}
                    withAgentPlans />
                <DeleteModal
                    isOpen={isOpenDelete}
                    toggleModal={this.toggleDeleteModal}
                    submit={this.deleteLine} />
            </React.Fragment>
        );
    }
}

export default ObjectEdit;
