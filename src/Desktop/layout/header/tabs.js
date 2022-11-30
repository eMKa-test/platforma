import React from "react";
import * as PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import axios from "../../common/axios";
import { controller } from "../../router/routeControl";
import { CONTENT_TABS_ROUTES_V2 } from "../../router/routePaths";
import styles from "./styles";
import { ROUTES_TABS, LINES_WITH_CAMS } from "../../../constants";
import RippleEffect from "../../../common/RippleEffect";

const makeUrl = (companySlug, tab, lineID, date, contentID, paramTab, pathname) => {
    let url = `/${companySlug}/content/${lineID}/${tab}`;
    if (tab === "model") {
        return pathname;
    }
    if (tab === paramTab) {
        if (contentID) {
            url = `/${companySlug}/content/${lineID}/${tab}/${date}/${contentID}`;
        }
        if (!contentID && date) {
            url = `/${companySlug}/content/${lineID}/${tab}/${date}`;
        }
    }
    return url;
};

const checkCamerasTabOnLine = (lineID) => {
    return LINES_WITH_CAMS.includes(lineID);
};

class HeaderTabs extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        params: PropTypes.object.isRequired,
        modeCalendar: PropTypes.bool.isRequired,
        showCalendar: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            tabs: [],
            routeTab: "",
        };
    }

    componentDidMount() {
        this.checkLine();
    }

    componentDidUpdate(prevProps) {
        const { params, modeCalendar, showCalendar } = this.props;
        if (modeCalendar && params.tab === "cameras") {
            showCalendar(false);
        }
        if (prevProps.params.lineID !== params.lineID) {
            this.checkLine();
        }
        if (prevProps.params.tab !== params.tab) {
            this.setNewTab(params.tab);
        }
    }

    setNewTab = (routeTab) => {
        this.setState({ routeTab });
    };

    checkLine = () => {
        this.setState({ routeTab: "", tabs: [] }, () => {
            this.getLineAvailable().then((res) => {
                if (res.lineTabs && res.routeTab) {
                    let { routeTab } = res;
                    const { companySlug, lineID } = res.routeParams;
                    const availableTabs = res.lineTabs.map((tab) => tab.toLowerCase());
                    const availableRoutes = ROUTES_TABS.filter((tab) => tab && availableTabs.includes(tab.to));
                    if (!availableTabs.includes(res.routeTab)) {
                        routeTab = availableTabs[0].toLowerCase();
                        this.setState({ tabs: availableRoutes, routeTab }, () => {
                            const url = `/${companySlug}/content/${lineID}/${routeTab}`;
                            this.props.history.replace(url);
                        });
                    } else {
                        this.setState({ tabs: availableRoutes, routeTab });
                    }
                }
            });
        });
    };

    async getLineAvailable() {
        try {
            const { params, params: { lineID, tab } } = controller(this.props.location, CONTENT_TABS_ROUTES_V2);
            const { payload } = await axios("get", `/user/api/lines/${lineID}`);
            const lineTabs = payload.tabs.filter((taba) => (
                taba === "CAMERAS" && checkCamerasTabOnLine(lineID) ? taba : taba !== "CAMERAS"
            ));
            return {
                lineTabs,
                routeTab: tab,
                routeParams: params,
            };
        } catch (e) {
            return {};
        }
    }

    renderTabs = (params, tabs, routeTab) => {
        const { classes, location: { pathname } } = this.props;
        return (
            <React.Fragment>
                {
                    tabs.map((link, i) => {
                        return (
                            <RippleEffect
                                key={link.to}
                                isActive={tabs[i].to === routeTab}>
                                <div className={classes.headerTab}>
                                    <Link
                                        className={classes.headerTabLabel}
                                        to={makeUrl(params.companySlug, link.to, params.lineID, params.date, params.contentID, params.tab, pathname)}>
                                        <div className={`${classes.headerTabText} ${tabs[i].to === "model" && classes.headerTabTextDisable}`}>
                                            {link.name}
                                        </div>
                                    </Link>
                                </div>
                            </RippleEffect>
                        );
                    })
                }
            </React.Fragment>
        );
    };

    render() {
        const { location, classes } = this.props;
        const { tabs, routeTab } = this.state;
        const { params } = controller(location, CONTENT_TABS_ROUTES_V2);
        return (
            <div className={classes.headerTabs}>
                {
                    routeTab && tabs.length > 0 && this.renderTabs(params, tabs, routeTab)
                }
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(React.memo(HeaderTabs)));
