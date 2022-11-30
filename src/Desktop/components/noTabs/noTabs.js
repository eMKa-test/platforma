import React from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import styles from "./style";

const NoTabs = ({ classes }) => (
    <div className={classes.notabsWrapper}>
        <p className={classes.notabsValue}>
            Доступные вкладки отсутствуют
        </p>
    </div>
);

NoTabs.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NoTabs);
