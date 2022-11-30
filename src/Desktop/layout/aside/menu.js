import React from "react";
import { withRouter } from "react-router-dom";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import LineIcon from "@material-ui/icons/GpsFixed";
import { controller } from "../../router/routeControl";
import {
    CONTENT_TABS_ROUTES,
    ASIDE_MENU_ROUTES,
} from "../../router/routePaths";
import {
    LINES_WITH_CAMS,
    PROMO,
} from "../../../constants";
import metrikaEvents, { LINE_SELECTION } from "../../../common/Metrika";
import styles from "./styles";

const filterPromo = (array) => PROMO.links.filter(({ value }) => array.includes(value));

class Menu extends React.Component {
    componentDidUpdate() {
        const { params } = controller(this.props.location, CONTENT_TABS_ROUTES);
        if (params.tab === "cameras") {
            if (!LINES_WITH_CAMS.includes(params.lineID)) {
                this.redirectFromTab();
            }
        }
    }

    redirectFromTab = () => {
        const { params } = controller(this.props.location, CONTENT_TABS_ROUTES);
        const url = `/${params.companySlug}/content/${params.lineID}/aerial/${params.date}`;
        this.props.history.replace(url);
    };

    historyPush = (lineID = "", tab = "", contentID, lineid) => {
        if (lineID === Number(lineid)) {
            return false;
        }
        const { currentCompany } = this.props;
        let url = `/${currentCompany.slug}/content/${lineID}/${tab}`;
        this.props.history.replace(url);
        return null;
    };

    historyPushPromo = (url) => {
        this.props.history.push(url);
    };

    formatDirectUrl = (tabs, routeTab) => {
        if (tabs.length > 0) {
            if (routeTab && tabs.includes(routeTab.toUpperCase())) {
                return routeTab;
            }
            return tabs[0].toLowerCase();
        }
        return "nomatch";
    };

    render() {
        const {
            classes, location, currentCompany,
        } = this.props;
        const routeParams = controller(location, ASIDE_MENU_ROUTES).params;
        return (
            <React.Fragment>
                {
                    currentCompany.contents && currentCompany.contents.length > 0 && (
                        <div className={classes.asideListObject}>
                            <ListItem
                                className={classNames(
                                    classes.item,
                                    classes.itemObject,
                                )}>
                                <ListItemText
                                    classes={{
                                        primary: classes.itemPrimary,
                                    }}>
                                    {
                                        PROMO.name.toUpperCase()
                                    }
                                </ListItemText>
                            </ListItem>
                            {
                                filterPromo(currentCompany.contents).map((el) => (
                                    <ListItem
                                        key={el.id}
                                        button
                                        onClick={() => this.historyPushPromo(`/${currentCompany.slug}${el.to}`)}
                                        className={classNames(
                                            classes.item,
                                            classes.itemActionable,
                                            classes.itemLine,
                                            {
                                                [classes.itemActiveItem]: routeParams.type === el.type,
                                            },
                                        )}>
                                        <ListItemIcon>
                                            <LineIcon className={classes.iconLines} />
                                        </ListItemIcon>
                                        <ListItemText
                                            className={classNames(
                                                {
                                                    [classes.itemLineText]: routeParams.type === el.type,
                                                },
                                            )}>
                                            {el.name}
                                        </ListItemText>
                                    </ListItem>
                                ))
                            }
                        </div>
                    )
                }
                {
                    currentCompany.projects && currentCompany.projects.map(({ id, name, lines }) => (
                        <React.Fragment key={id}>
                            <div className={classes.asideListObject}>
                                <ListItem
                                    className={classNames(
                                        classes.item,
                                        classes.itemObject,
                                    )}>
                                    <ListItemText
                                        classes={{
                                            primary: classes.itemPrimary,
                                        }}>
                                        {name.toUpperCase()}
                                    </ListItemText>
                                </ListItem>
                                {
                                    lines.length > 0 && lines.map((line) => {
                                        if (line.projectId === id) {
                                            return (
                                                <ListItem
                                                    key={line.id}
                                                    button
                                                    onClick={() => {
                                                        metrikaEvents.emit(
                                                            LINE_SELECTION,
                                                            {
                                                                projectName: name,
                                                                lineName: line.name,
                                                                from: window.location.pathname,
                                                                interface: "sideBar",
                                                            },
                                                        );
                                                        this.historyPush(
                                                            line.id,
                                                            this.formatDirectUrl(line.tabs, routeParams.tab), routeParams.contentID, routeParams.lineID,
                                                        );
                                                    }}
                                                    className={classNames(
                                                        classes.item,
                                                        classes.itemActionable,
                                                        classes.itemLine,
                                                        {
                                                            [classes.itemActiveItem]: Number(routeParams.lineID) === line.id,
                                                        },
                                                    )}>
                                                    <ListItemIcon>
                                                        <LineIcon className={classes.iconLines} />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        className={classNames(
                                                            {
                                                                [classes.itemLineText]: Number(routeParams.lineID) === line.id,
                                                            },
                                                        )}>
                                                        {line.name}
                                                    </ListItemText>
                                                </ListItem>
                                            );
                                        }
                                        return null;
                                    })
                                }
                            </div>
                        </React.Fragment>
                    ))
                }
            </React.Fragment>
        );
    }
}

Menu.propTypes = {
    classes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    currentCompany: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Menu));
