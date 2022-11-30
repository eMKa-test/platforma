import React from "react";
import * as PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

import metrikaEvents, { LINE_SELECTION } from "../../../common/Metrika";
import styles from "./styles";

const sendMetrika = (args) => () => {
    metrikaEvents.emit(LINE_SELECTION, { ...args, interface: "linesGrid" });
};

function LinesGridItem(props) {
    const {
        classes, projectName, url, line,
    } = props;
    return (
        <div className={classes.gridItem}>
            <Link
                onClick={sendMetrika({
                    projectName,
                    lineName: line.name,
                    from: window.location.pathname,
                })}
                className={classes.itemLink}
                to={url}>
                <div className={classes.gridItemHeader}>
                    <span className={classes.gridItemName}>
                        {line.name}
                    </span>
                    {line.description ? (
                        <span className={classes.gridItemDescription}>
                            {String(line.description).substr(0, 65)}
                            {line.description.length > 65 ? "..." : ""}
                        </span>
                    ) : null}
                </div>
                <div
                    className={classes.gridItemImage}
                    style={{
                        backgroundImage: `url(${line.image ? line.image.tmb : "/public/assets/placeholders/stub.png"})`,
                    }} />
            </Link>
        </div>
    );
}

LinesGridItem.propTypes = {
    classes: PropTypes.shape({
        gridItem: PropTypes.string,
        itemLink: PropTypes.string,
        gridItemImage: PropTypes.string,
        gridItemHeader: PropTypes.string,
        gridItemName: PropTypes.string,
        gridItemDescription: PropTypes.string,
    }).isRequired,
    projectName: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    line: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        image: PropTypes.shape({
            tmb: PropTypes.string,
        }),
    }).isRequired,
};

export default withStyles(styles)(React.memo(LinesGridItem));
