import React from "react";
import * as PropTypes from "prop-types";
import { Card, CardBody } from "reactstrap";
import classNames from "classnames";
import { mapToCssModules } from "reactstrap/lib/utils";

const propTypes = {
    header: PropTypes.string,
    icon: PropTypes.string,
    color: PropTypes.string,
    value: PropTypes.string,
    email: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    cssModule: PropTypes.object,
    invert: PropTypes.bool,
    status: PropTypes.string.isRequired,
};

const defaultProps = {
    header: "87.500",
    icon: "icon-user",
    color: "info",
    value: "25",
    children: "Visitors",
    invert: false,
    email: "",
};

const convertKind = {
    USER: "Пользователь",
    AGENT: "Агент",
    SUPER: "Администратор",
    AUDITOR: "Аудитор",
    MODERATOR: "Модератор",
};

const pStyles = {
    fontSize: "1rem",
    margin: 0,
};

const cardBodyStyle = {
    padding: 16,
};

function Widget04(props) {
    const {
        className, cssModule, header, icon, color, value, children, invert, email, status, ...rest
    } = props;

    const card = {
        style: "",
        bgColor: "",
        icon,
    };

    if (invert) {
        card.style = "text-white";
        card.bgColor = `bg-${color}`;
    }

    const classes = mapToCssModules(classNames(className, card.style, card.bgColor), cssModule);

    return (
        <Card
            className={classes}
            {...rest}>
            <CardBody style={cardBodyStyle}>
                <div className="h1 text-muted text-right mb-2">
                    <i className={card.icon} />
                    <p style={pStyles}>
                        {convertKind[status]}
                    </p>
                </div>
                <div className="h4 mb-1">{header}</div>
                <small
                    style={{ fontSize: "1rem" }}
                    className="d-block mb-2 text-muted font-weight-bold">
                    {email}
                </small>
                {children}
            </CardBody>
        </Card>
    );
}

Widget04.propTypes = propTypes;
Widget04.defaultProps = defaultProps;

export default React.memo(Widget04);
