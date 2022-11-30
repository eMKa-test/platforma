import React from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import styles from "./styles";
import Spinner from "../../components/spinner";
import { RightsContext } from "../../providers/Rights";

const LinesGrid = React.lazy(() => import("../../view/LinesGrid"));

const ObjectsView = (props) => {
    const { currentCompany, mainLoader } = React.useContext(RightsContext);
    const { classes } = props;
    return (
        <div className={classes.root}>
            {!currentCompany.name ? (
                <p style={{ textAlign: "center" }}>Нет доступных объектов</p>
            ) : null}
            <React.Suspense fallback={<Spinner />}>
                {mainLoader ? <Spinner /> : <LinesGrid />}
            </React.Suspense>
        </div>
    );
};

ObjectsView.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(React.memo(ObjectsView));
