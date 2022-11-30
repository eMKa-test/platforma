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
import { PROMO } from "../../../constants";

const PromoGrid = ({ classes }) => {
    return (
        <React.Fragment>
            <div className="grid-item-wrapper">
                <GridList
                    cols={12}
                    spacing={0}
                    className={classes.gridList}>
                    <GridListTile
                        key="Subheader"
                        style={{height: "auto", textTransform: "uppercase" }}
                        cols={12}>
                        <ListSubheader
                            className={classes.gridObjectName}
                            component="div">
                            {PROMO.name}
                        </ListSubheader>
                    </GridListTile>
                    {
                        PROMO.links.map((link, i) => {
                            const url = `/${link.to}`;
                            return (
                                <GridListTile
                                    key={link.id}
                                    cols={6}
                                    rows={1.7}
                                    classes={{
                                        root: classes.gridItem,
                                    }}>
                                    <div
                                        style={{ backgroundImage: `url(${bgItems})` }}
                                        className={classNames(
                                            classes.wrapperBackground,
                                            classes.wrapperBackgroundContain,
                                        )}>
                                        <Link
                                            className={classes.itemLink}
                                            to={url}>
                                            <div
                                                className={classNames(
                                                    classes.gridItem,
                                                    classes.gridItemBG,
                                                )}>
                                                <div className={classes.gridItemHeader}>
                                                    <span className={classes.gridItemIndex}>
                                                        {i + 1}
                                                    </span>
                                                    <span className={classes.gridItemTitle}>
                                                        {link.name}
                                                    </span>
                                                </div>
                                                <div className={classes.gridItemContent}>
                                                    <span className={classes.gridItemTextDecor} />
                                                    <span className={classes.gridItemText}>
                                                        {substr(link.name)}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </GridListTile>
                            );
                        })
                    }
                </GridList>
            </div>
        </React.Fragment>
    );
}

export default withStyles(styles)(PromoGrid);
