import React from "react";
import * as PropTypes from "prop-types";
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

function showInputsRule(kind) {
    return kind !== "MODERATOR" && kind !== "AUDITOR";
}

class ModalUserNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            projects: [],
        };
    }

    componentDidUpdate() {
        if (this.state.companies.length !== this.props.accessCompanies.length) {
            this.props.changeAccessState(this.state.companies);
        }
        if (this.state.projects.length !== this.props.accessProject.length) {
            this.props.changeAccessProject(this.state.projects);
        }
    }

    selectAccessProject = (e, projectId) => {
        this.props.changeAccessProject([projectId]);
        this.setState({
            projects: Array.of(Number(projectId)),
        });
    };

    selectAccessCompany = (e, companyId) => {
        let result = this.state.companies;
        if (result.includes(companyId)) {
            result = result.filter((object) => object !== companyId);
        } else {
            result.push(companyId);
        }
        this.props.changeAccessState(result);
        this.setState({
            companies: result,
        });
    };

    handleSwitchUsers = (kind, objects, companies, projects) => {
        switch (kind) {
            case "USER":
                return (
                    <React.Fragment>
                        <p className="mb-2">
                            Доступные компании для пользователя:
                        </p>
                        <div className="access-checks-container mb-4">
                            {
                                companies.map((el) => (
                                    <React.Fragment key={el.name}>
                                        <FormGroup className="mb-0 select-access">
                                            <Label
                                                className="mb-0"
                                                style={{ width: "100%", paddingLeft: "1rem" }}
                                                htmlFor={`${el.name}checks`}>
                                                {substr(el.name, 30)}
                                            </Label>
                                            <Input
                                                checked={this.state.companies.includes(el.id)}
                                                id={`${el.name}checks`}
                                                type="checkbox"
                                                onChange={(e) => this.selectAccessCompany(e, el.id)} />
                                        </FormGroup>
                                    </React.Fragment>
                                ))
                            }
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
                            {
                                objects.map((el) => (
                                    <React.Fragment key={el.name}>
                                        <FormGroup className="mb-0 select-access">
                                            <Label
                                                className="mb-0"
                                                style={{ width: "100%", paddingLeft: "1rem" }}
                                                htmlFor={`${el.name}radio`}>
                                                {substr(el.name, 30)}
                                            </Label>
                                            <Input
                                                checked={projects.includes(el.id)}
                                                id={`${el.name}radio`}
                                                type="radio"
                                                onChange={(e) => this.selectAccessProject(e, el.id)} />
                                        </FormGroup>
                                    </React.Fragment>
                                ))
                            }
                        </div>
                    </React.Fragment>
                );
            default:
                return null;
        }
    };

    render() {
        const {
            isOpenNew,
            toggleModalNewUser,
            submitUser,
            pwdChkErr,
            changeRole,
            objects,
            companies,
            role,
        } = this.props;
        const { projects } = this.state;
        return (
            <Modal
                isOpen={isOpenNew}
                toggle={toggleModalNewUser}
                className="modal-primary">
                <ModalHeader toggle={toggleModalNewUser}>Создание нового пользователя</ModalHeader>
                <Form onSubmit={submitUser}>
                    <ModalBody>
                        <FormGroup>
                            <Label htmlFor="email">Отображаемое имя</Label>
                            <Input
                                type="text"
                                id="name"
                                placeholder="Введите любое имя"
                                required />
                        </FormGroup>
                        <RolesSwitch changeRole={changeRole} role={role} />
                        {this.handleSwitchUsers(role, objects, companies, projects)}
                        <LoginPwdInputs pwdChkErr={pwdChkErr} />
                        {
                            showInputsRule(role) && (
                                <FormGroup>
                                    <label className="d-flex">
                                        <input
                                            type="checkbox"
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
                            Создать
                        </Button>
                        {" "}
                        <Button
                            color="secondary"
                            type="button"
                            onClick={toggleModalNewUser}>
                            Отмена
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }
}

ModalUserNew.propTypes = {
    isOpenNew: PropTypes.bool.isRequired,
    toggleModalNewUser: PropTypes.func.isRequired,
    accessProject: PropTypes.array.isRequired,
    companies: PropTypes.array.isRequired,
    objects: PropTypes.array.isRequired,
    pwdChkErr: PropTypes.bool.isRequired,
    submitUser: PropTypes.func.isRequired,
    changeAccessState: PropTypes.func.isRequired,
    changeRole: PropTypes.func.isRequired,
    changeAccessProject: PropTypes.func.isRequired,
    accessCompanies: PropTypes.array.isRequired,
    role: PropTypes.string,
};

export default ModalUserNew;
