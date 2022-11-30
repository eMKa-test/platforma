import React from "react";
import * as PropTypes from "prop-types";
import { ButtonGroup, Button } from "reactstrap";

const RolesSwitch = ({ role = "USER", changeRole }) => {
    return (
        <ButtonGroup className="mb-3 w-100 admin-modal__buttons">
            <Button
                onClick={() => changeRole("USER")}
                active={role === "USER"}>
                Пользователь
            </Button>
            <Button
                onClick={() => changeRole("AGENT")}
                active={role === "AGENT"}>
                Полевой агент
            </Button>
            <Button
                onClick={() => changeRole("AUDITOR")}
                active={role === "AUDITOR"}>
                Аудитор
            </Button>
            <Button
                onClick={() => changeRole("SUPER")}
                active={role === "SUPER"}>
                Администратор
            </Button>
            <Button
                onClick={() => changeRole("MODERATOR")}
                active={role === "MODERATOR"}>
                Модератор
            </Button>
        </ButtonGroup>
    );
};

RolesSwitch.propTypes = {
    role: PropTypes.string,
    changeRole: PropTypes.func.isRequired,
};

export default RolesSwitch;
