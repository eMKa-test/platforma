import React from "react";
import * as PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "./tabs";
import ToggleBtns from "./togglebtns";
import { CALENDAR_TABS_ACCESS } from "../../../constants";
import styles from "./styles";

const Calendar = React.lazy(() => import("../../components/calendar"));

class Header extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tabs: [],
        };
    }

    setAvailableLineTabs = (tabs) => this.setState({ tabs });

    componentDidUpdate(prevProps) {
        const { showHeader } = this.props;
        if (
            (prevProps.showHeader !== showHeader && !showHeader)
            || (prevProps.sublineMode !== this.props.sublineMode && this.props.sublineMode)
        ) {
            this.props.showCalendar(false);
            this.props.showMap(false);
            this.props.showModel(false);
        }
    }

    render() {
        const { params } = this.props;
        if (params.typeView === "promo") {
            return <span />;
        }
        const {
            classes, showHeader, slug, history, ...other
        } = this.props;
        return (
            <div className={classes.appContent}>
                <AppBar
                    component="div"
                    className={classes.secondaryBar}
                    color="primary"
                    position="static"
                    elevation={0}>
                    {slug && params.tab !== "nomatch" && params.lineID && showHeader && (
                        <div className={classes.secondaryBarChild}>
                            <Tabs
                                setAvailableLineTabs={this.setAvailableLineTabs}
                                params={params}
                                slug={slug}
                                {...this.props}
                                {...other} />
                            {!isNaN(params.lineID) && (
                                <ToggleBtns
                                    tabs={this.state.tabs}
                                    slug={slug}
                                    params={params}
                                    {...other} />
                            )}
                            <React.Suspense fallback={<span />}>
                                {showHeader &&
                                CALENDAR_TABS_ACCESS.includes(params.tab) &&
                                !isNaN(params.lineID) && (
                                    <Calendar
                                        {...other}
                                        params={params} />
                                )}
                            </React.Suspense>
                        </div>
                    )}
                </AppBar>
            </div>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    params: PropTypes.object,
    showHeader: PropTypes.bool.isRequired,
    showMap: PropTypes.func.isRequired,
    showModel: PropTypes.func.isRequired,
    showCalendar: PropTypes.func.isRequired,
    slug: PropTypes.string,
    location: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
