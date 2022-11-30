import React from "react";
import * as PropTypes from "prop-types";
import get from "lodash/get";
import { matchPath } from "react-router-dom";
import { Button } from "reactstrap";
import HeaderCompany from "Admin/common/HeaderCompany";
import CompaniesEditModal from "Admin/common/CompanyEditModal";
import ObjectNewModal from "Admin/common/ObjectNewModal";
import DeleteModal from "Admin/common/DeleteModal";

import ObjectGrid from "../Objects/ObjectsGrid";

class CompaniesEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isNewObject: false,
            isOpenDelete: false,
            accessCompanies: [],
            contentType: [],
            deleteObjectID: null,
        };
    }

    componentDidMount() {
        this.fetchCompanyData();
    }

    fetchCompanyData = () => {
        const id = get(matchPath(get(this.props, "location.pathname"), {
            path: "/admin/companies/:id",
        }), "params.id", -1);
        this.props.getCompaniesByID(id);
    };

    componentWillUnmount() {
        this.syncContentType([]);
    }

    syncContentType = (val) => this.setState({ contentType: val });

    setAccessCompanies = (val) => this.setState({ accessCompanies: val });

    submitCompany = (ev) => {
        ev.preventDefault();
        ev.persist();
        if (ev.target.name.value) {
            this.setState({ isOpen: false }, () => {
                this.props.putCompanies({
                    company: {
                        ...this.props.currentCompany,
                        name: ev.target.name.value,
                        contents: this.state.contentType,
                    },
                });
                this.syncContentType([]);
            });
        }
    };

    submitNewObject = (ev) => {
        ev.preventDefault();
        ev.persist();
        if (ev.target.name.value && ev.target.description.value !== "") {
            this.setState({ isOpen: false }, () => {
                this.props.putObject({
                    object: {
                        name: ev.target.name.value,
                        description: ev.target.description.value,
                        gps: {
                            lat: ev.target.lat.value,
                            long: ev.target.long.value,
                        },
                        orderWeight: ev.target.orderWeight.value,
                        companies: this.state.accessCompanies,
                    },
                });
                this.setAccessCompanies([]);
            });
        }
    };

    toggleModal = () => this.setState((state) => ({ isOpen: !state.isOpen }));

    toggleObjectModal = () => this.setState((state) => ({ isNewObject: !state.isNewObject }));

    toggleDeleteModal = (val) => this.setState((state) => ({
        isOpenDelete: !state.isOpenDelete,
        deleteObjectID: val,
    }));

    deleteHandleObject = (ev) => {
        ev.preventDefault();
        this.props.deleteObject(this.state.deleteObjectID);
        this.toggleDeleteModal(null);
        this.props.getCompaniesByID(this.props.currentCompany.id);
    };

    render() {
        const { currentCompany, objects, companies } = this.props;
        const { isOpen, isNewObject, isOpenDelete } = this.state;
        return (
            <React.Fragment>
                <HeaderCompany
                    contents={currentCompany.contents}
                    onClickEdit={this.toggleModal}
                    title={currentCompany.name}
                    id={currentCompany.id}
                    image={currentCompany.image}
                    video={currentCompany.video}
                    uploadUrl={`/admin/api/companies/${currentCompany.id}`} />
                <Button
                    color="primary"
                    onClick={this.toggleObjectModal}>
                    Добавить новый Объект +
                </Button>
                <ObjectGrid
                    toggleDeleteModal={this.toggleDeleteModal}
                    objects={objects}
                    companyID={currentCompany.id} />
                {
                    isOpen && (
                        <CompaniesEditModal
                            syncContentType={this.syncContentType}
                            isOpen={isOpen}
                            company={currentCompany}
                            defaultName={currentCompany.name}
                            toggleModal={this.toggleModal}
                            submit={this.submitCompany} />
                    )
                }
                {
                    isNewObject && (
                        <ObjectNewModal
                            setAccessCompanies={this.setAccessCompanies}
                            companies={companies}
                            currentCompany={currentCompany}
                            isOpen={isNewObject}
                            toggleModal={this.toggleObjectModal}
                            submit={this.submitNewObject} />
                    )
                }
                {
                    isOpenDelete && (
                        <DeleteModal
                            isOpen={isOpenDelete}
                            toggleModal={this.toggleDeleteModal}
                            submit={this.deleteHandleObject} />
                    )
                }
            </React.Fragment>
        );
    }
}

CompaniesEdit.propTypes = {
    currentCompany: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        image: PropTypes.object,
        gps: PropTypes.shape({
            lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            long: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        }),
        video: PropTypes.object,
    }).isRequired,
    objects: PropTypes.array.isRequired,
    companies: PropTypes.array.isRequired,
    putCompanies: PropTypes.func.isRequired,
    getCompaniesByID: PropTypes.func.isRequired,
    putObject: PropTypes.func.isRequired,
    deleteObject: PropTypes.func.isRequired,
};

export default CompaniesEdit;
