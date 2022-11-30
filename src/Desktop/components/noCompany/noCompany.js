import React from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = () => ({
    noCompanyWrapper: {
        width: "100%",
        display: "flex",
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    noCompanyValue: {
        color: "#fff",
        margin: 0,
    },
});

const NoCompany = (props) => {
    const { classes } = props;
    return (
        <div className={classes.noCompanyWrapper}>
            <p className={classes.noCompanyValue}>
                Нет доступных компаний
            </p>
        </div>
    );
};

NoCompany.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NoCompany);
