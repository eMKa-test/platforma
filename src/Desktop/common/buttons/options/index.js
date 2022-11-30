import React from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import commonBtnStyles from "../commonBtnStyles";
import styles from "./styles";

function Options(props) {
    const { classes, onClick = () => {} } = props;

    return (
        <button
            type="button"
            className={classNames(classes.commonButton, classes.optionsButton)}
            onClick={onClick}>
            <span className={classNames(classes.commonButtonSpan, classes.optionsButtonSpan)}>
                &hellip;
            </span>
        </button>
    );
}

Options.propTypes = {
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func,
};

export default withStyles(() => ({ ...commonBtnStyles(), ...styles() }))(Options);
