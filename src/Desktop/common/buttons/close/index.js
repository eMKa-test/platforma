import React from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import commonBtnStyles from "../commonBtnStyles";
import styles from "./styles";

function Close(props) {
    const {
        classes, onClick = () => {}, extendClassBtn = "", extendClassVal = "",
    } = props;

    return (
        <button
            type="button"
            className={classNames(classes.commonButton, classes.closeButton, extendClassBtn)}
            onClick={onClick}>
            <span className={classNames(classes.commonButtonSpan, extendClassVal)}>&times;</span>
        </button>
    );
}

Close.propTypes = {
    classes: PropTypes.object.isRequired,
    extendClassBtn: PropTypes.string,
    extendClassVal: PropTypes.string,
    onClick: PropTypes.func,
};

export default withStyles(() => ({ ...commonBtnStyles(), ...styles() }))(Close);
