import React from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import styles from "./styles";
import LinesGridItem from "./LinesGridItem";
import { RightsContext } from "../../providers/Rights";

/**
 * @return {null}
 */
function LinesGrid(props) {
    const { currentCompany } = React.useContext(RightsContext);
    if (!Array.isArray(currentCompany.projects)) {
        return null;
    }
    const { classes } = props;
    return currentCompany.projects.map((item) => (
        <React.Fragment key={item.id}>
            <div className={classes.gridObjectName}>{item.name}</div>
            <div className={classes.gridList}>
                {item.lines.map((line) => {
                    let tab = "";
                    if (line.tabs.length > 0) {
                        tab = line.tabs[0].toLowerCase();
                    } else {
                        tab = "nomatch";
                    }
                    return (
                        <LinesGridItem
                            key={line.id}
                            url={`/${currentCompany.slug}/content/${line.id}/${tab}`}
                            projectName={item.name}
                            line={line} />
                    );
                })}
            </div>
        </React.Fragment>
    ));
}

LinesGrid.propTypes = {
    classes: PropTypes.shape({
        gridObjectName: PropTypes.string,
        gridList: PropTypes.string,
    }).isRequired,
};

export default withStyles(styles)(React.memo(LinesGrid));
