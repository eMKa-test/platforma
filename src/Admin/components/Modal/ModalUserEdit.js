import React, { Component } from "react";
import * as PropTypes from "prop-types";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Form,
    FormGroup,
    Input,
    Label,
} from "reactstrap";

import { substr } from "../../../utils/helpers";
import RolesSwitch from "./RolesSwitch";
import LoginPwdInputs from "./LoginPwdInputs";

const labelStyle = {
    width: "100%",
    paddingLeft: "1rem",
};

function showInputsRule(kind) {
    return kind !== "MODERATOR" && kind !== "AUDITOR";
}

class ModalUserEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            status: null,
            kind: null,
            name: "",
            email: "",
            companies: [],
            projects: [],
            canCreateTmpUser: false,
        };
    }

    componentDidMount() {
        const { user } = this.props;
        if (!isEmpty(user)) {
            if (!user.companies) {
                user.companies = [];
            }
            if (!user.projects) {
                user.projects = [];
            }
            this.setState({ ...user });
        }
    }

    componentDidUpdate() {
        if (this.state.companies.length !== this.props.accessCompanies.length) {
            this.props.changeAccessState(this.state.companies);
        }
    }

    componentWillUnmount() {
        this.props.getUsers();
    }

    handleSelect = (type, id) => () => {
        let arr = get(this.state, type, []);
        if (arr.includes(id)) {
            arr = arr.filter((object) => object !== id);
        } else {
            arr.push(id);
        }
        this.setState((state) => ({
            [type]: [...arr],
            projects: type === "projects" ? Array.of(id) : state.projects,
        }), () => {
            switch (type) {
                case "projects": {
                    this.props.changeAccessProject([id]);
                    break;
                }
                default: {
                    this.props.changeAccessState(arr);
                }
            }
        });
    };

    changeRole = (val) => {
        this.setState({ kind: val });
    };

    renderCheckBox = (item, checked, type) => (
        <React.Fragment>
            <FormGroup className="mb-0 select-access">
                <Label
                    className="mb-0"
                    style={labelStyle}
                    htmlFor={`${item.id}checks`}>
                    {substr(item.name, 30)}
                </Label>
                <Input
                    checked={checked}
                    id={`${item.id}checks`}
                    type="checkbox"
                    onChange={this.handleSelect(type, item.id)} />
            </FormGroup>
        </React.Fragment>
    );

    renderRadio = (item, checked, type) => (
        <React.Fragment>
            <FormGroup className="mb-0 select-access">
                <Label
                    className="mb-0"
                    style={labelStyle}
                    htmlFor={`${item.id}radio`}>
                    {substr(item.name, 30)}
                </Label>
                <Input
                    checked={checked}
                    id={`${item.id}radio`}
                    type="radio"
                    onChange={this.handleSelect(type, item.id)} />
            </FormGroup>
        </React.Fragment>
    );

    handleSwitchUsers = (projects) => {
        const { companies, objects } = this.props;
        switch (this.state.kind) {
            case "USER":
                return (
                    <React.Fragment>
                        <p className="mb-2">
                            Доступные компании для пользователя:
                        </p>
                        <div className="access-checks-container mb-4">
                            {!isEmpty(companies) ? companies.map((el) => (
                                <React.Fragment key={String(el.id)}>
                                    {this.renderCheckBox(el, this.state.companies.includes(el.id), "companies")}
                                </React.Fragment>
                            )) : null}
                        </div>
                    </React.Fragment>
                );
            case "AGENT":
                return (
                    <React.Fragment>
                        <p className="mb-2">
                            Доступные объекты для агента:
                        </p>
                        <div className="access-checks-container mb-4">
                            {objects.map((el) => (
                                <React.Fragment key={String(el.id)}>
                                    {this.renderRadio(el, projects.includes(el.id), "projects")}
                                </React.Fragment>
                            ))}
                        </div>
                    </React.Fragment>
                );
            default: {
                return null;
            }
        }
    };

    render() {
        const {
            name, email, id, status, kind, projects, canCreateTmpUser,
        } = this.state;
        return (
            <Modal
                isOpen={this.props.isOpenEdit}
                toggle={this.props.toggleModalEditUser}
                className="modal-primary admin-modal_change-width">
                <ModalHeader toggle={this.props.toggleModalEditUser}>
                    Редактирование пользователя
                </ModalHeader>
                <Form onSubmit={(e) => this.props.submitUser(e, "edit", id, status, kind)}>
                    <ModalBody>
                        <FormGroup>
                            <Label htmlFor="name">Отображаемое имя</Label>
                            <Input
                                type="text"
                                id="name"
                                placeholder="Введите любое имя"
                                defaultValue={name} />
                        </FormGroup>
                        <RolesSwitch changeRole={this.changeRole} role={kind} />
                        {this.handleSwitchUsers(projects)}
                        <LoginPwdInputs pwdChkErr={this.props.pwdChkErr} email={email} />
                        {
                            showInputsRule(kind) && (
                                <FormGroup>
                                    <label className="d-flex">
                                        <input
                                            type="checkbox"
                                            defaultChecked={canCreateTmpUser}
                                            id="canCreateTmpUser" />
                                        &nbsp;
                                        Может создавать временные аккаунты
                                    </label>
                                </FormGroup>
                            )
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            type="submit">
                            Сохранить
                        </Button>
                        &nbsp;
                        <Button
                            color="secondary"
                            type="button"
                            onClick={this.props.toggleModalEditUser}>
                            Отмена
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }
}

ModalUserEdit.propTypes = {
    toggleModalEditUser: PropTypes.func,
    changeAccessProject: PropTypes.func,
    companies: PropTypes.array,
    objects: PropTypes.array,
    pwdChkErr: PropTypes.bool,
    isOpenEdit: PropTypes.bool,
    submitUser: PropTypes.func,
    changeAccessState: PropTypes.func,
    user: PropTypes.object,
    getUsers: PropTypes.func,
    accessCompanies: PropTypes.array,
};


export default ModalUserEdit;
