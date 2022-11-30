import React from "react";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import { goldColor } from "../../common/constants";

const StyledLoader = withStyles({
    root: {
        flexGrow: 1,
        height: 2,
        backgroundColor: goldColor,
    },
})(LinearProgress);

const styles = {
    linearLoaderWrapper: {
        position: "absolute",
        top: 1,
        left: 0,
        width: "100%",
        zIndex: 1,
    },
};

export default function LinearIndeterminate() {

    return (
        <div style={styles.linearLoaderWrapper}>
            <StyledLoader />
        </div>
    );
};
