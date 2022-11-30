import React from "react";
import * as PropTypes from "prop-types";
import { palitter } from "../../constants";

const Button = (props) => (
    <button
        style={palitter[props.styles] || palitter.default}
        className={`agent-btn ${props.classes}`}
        disabled={props.disMode}
        onClick={props.handleFunc}
        type="button">
        {props.children}
    </button>
);

Button.propTypes = {
    classes: PropTypes.string,
    styles: PropTypes.string,
    handleFunc: PropTypes.func,
    disMode: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.bool,
    ]),
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
        PropTypes.array,
        PropTypes.bool,
    ]),
};

export default Button;
