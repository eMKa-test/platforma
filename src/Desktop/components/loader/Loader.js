import React from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import style from "./style";

const Loader = ({ classes, size, thickness }) => (
    <div className={classes.progressItemsWrapper}>
        <CircularProgress
            size={size}
            thickness={thickness}
            className={classes.itemLoader} />
    </div>
);

Loader.propTypes = {
    classes: PropTypes.object.isRequired,
    size: PropTypes.number,
    thickness: PropTypes.number,
};

export default withStyles(style)(Loader);
