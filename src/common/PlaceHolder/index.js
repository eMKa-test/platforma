import React from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

const PlaceHolder = (props) => {
    const { classes, type, hide } = props;
    return (
        <div
            className={classNames(classes.placeHolderWrapper, {
                [classes.hidden]: hide,
            })}>
            <img
                src={type === "IMAGE"
                    ? "/public/assets/placeholders/photo_icon.svg"
                    : "/public/assets/placeholders/video_icon.svg"}
                alt="content" />
        </div>
    );
};

PlaceHolder.propTypes = {
    classes: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    hide: PropTypes.bool,
};

export default withStyles(styles)(PlaceHolder);
