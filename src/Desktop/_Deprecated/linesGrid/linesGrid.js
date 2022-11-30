import React, { Component } from "react";
import * as PropTypes from "prop-types";
import { Link } from "react-router-dom";

import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import ListSubheader from "@material-ui/core/ListSubheader";
import { substr } from "../../../utils/helpers";
import bgItems from "../../assets/icons/stub.png";
import styles from "./styles";
import metrikaEvents, { LINE_SELECTION } from "../../../common/Metrika";

const yesterday = moment().add(-1, "day").format("YYYY-MM-DD");

class LinesGrid extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        user: PropTypes.object,
        projects: PropTypes.array,
        slug: PropTypes.string.isRequired,
    };

    renderItemGrids = (item) => {
        const { classes, user, slug } = this.props;
        if (!user) {
            return null;
        }
        return (
            <div key={item.id}>
                <ListSubheader
                    className={classes.gridObjectName}
                    component="div">
                    {item.name}
                </ListSubheader>
                <GridList
                    cols={12}
                    spacing={0}
                    className={classes.gridList}>
                    {item.lines.map((line, i) => {
                        let tab = "";
                        if (line.tabs.length > 0) {
                            tab = line.tabs[0].toLowerCase();
                        } else {
                            tab = "nomatch";
                        }
                        const url = `/${slug}/content/${line.id}/${tab}/${yesterday}`;
                        return (
                            <GridListTile
                                key={line.id}
                                cols={line.id === 1 ? 12 : 4}
                                rows={1.7}
                                classes={{
                                    root: classes.gridItem,
                                }}>
                                <div
                                    onClick={() => {
                                        metrikaEvents.emit(
                                            LINE_SELECTION,
                                            {
                                                projectName: item.name,
                                                lineName: line.name,
                                                from: window.location.pathname,
                                                interface: "linesGrid",
                                            },
                                        );
                                    }}
                                    style={line.image ? { backgroundImage: `url(${line.image.src})` }
                                        : { backgroundImage: `url(${bgItems})` }}
                                    className={classNames(classes.wrapperBackground, {
                                        [classes.wrapperBackgroundCover]: line.image,
                                        [classes.wrapperBackgroundFloat]: !line.image,
                                    })}>
                                    <Link
                                        className={classes.itemLink}
                                        to={url}>
                                        <div
                                            className={classNames(classes.gridItem, {
                                                [classes.gridItemBG]: line.image,
                                                [classes.gridItemSimple]: !line.image,
                                            })}>
                                            <div className={classes.gridItemHeader}>
                                                <span className={classes.gridItemIndex}>
                                                    {i + 1}
                                                </span>
                                                <span className={classes.gridItemTitle}>
                                                    {line.name}
                                                </span>
                                            </div>
                                            <div className={classes.gridItemContent}>
                                                <span className={classes.gridItemTextDecor} />
                                                <span className={classes.gridItemText}>
                                                    {substr(line.description)}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </GridListTile>
                        );
                    })}
                </GridList>
            </div>
        );
    };

    render() {
        const { projects } = this.props;
        if (!projects) return null;
        return (
            <React.Fragment>
                <div className="grid-item-wrapper">
                    {
                        projects.length > 0 &&
                        projects.map((item) => this.renderItemGrids(item))
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(LinesGrid);
