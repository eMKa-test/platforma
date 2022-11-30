import React from "react";
import get from "lodash/get";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Hidden from "@material-ui/core/Hidden";

import { drawerWidth } from "../common/theme";
import styles from "./styles";
import { getContentController } from "../router/routeControl";
import { ALL_MENU_ITEMS_ROUTES_V2 } from "../router/routePaths";

import Aside from "./aside";
import Main from "./main";

const paperProps = { style: { width: drawerWidth, borderRight: "none" } };

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHeader: false,
        };
    }

    componentDidMount() {
        const { location } = this.props;
        const { params: { typeView } } = getContentController(location, ALL_MENU_ITEMS_ROUTES_V2);
        if (!this.state.showHeader && (typeView === "promo" || typeView === "content")) {
            this.setShowHeader(true);
        }
    }

    setShowHeader = (val) => {
        this.setState({
            showHeader: val,
        });
    };

    componentDidUpdate(prevProps, prevState) {
        const { params: { typeView } } = getContentController(this.props.location, ALL_MENU_ITEMS_ROUTES_V2);
        if ((typeView !== "objects") &&
            !this.state.showHeader &&
            !prevState.showHeader) {
            this.setShowHeader(true);
        }
    }

    render() {
        const {
            classes,
            children,
            location,
            user,
            companies,
            currentCompany,
            changeCompany,
            sideLoader,
            ...other
        } = this.props;

        const { params } = getContentController(location.pathname, ALL_MENU_ITEMS_ROUTES_V2);
        return (
            <div className={classes.root}>
                <CssBaseline />
                <nav className={classes.drawer}>
                    <Hidden
                        smUp
                        implementation="js">
                        <Aside
                            {...this.state}
                            setShowHeader={this.setShowHeader}
                            sideLoader={sideLoader}
                            changeCompany={changeCompany}
                            currentCompany={currentCompany}
                            companies={companies}
                            user={user}
                            PaperProps={paperProps}
                            variant="temporary"
                            open />
                    </Hidden>
                    <Hidden
                        xsDown
                        implementation="css">
                        <Aside
                            {...this.state}
                            setShowHeader={this.setShowHeader}
                            sideLoader={sideLoader}
                            changeCompany={changeCompany}
                            currentCompany={currentCompany}
                            companies={companies}
                            user={user}
                            PaperProps={paperProps} />
                    </Hidden>
                </nav>
                <div className={classes.appContent}>
                    <Main
                        {...this.state}
                        {...other}
                        setShowHeader={this.setShowHeader}
                        user={user}
                        location={location}
                        params={params}>
                        {
                            children
                        }
                    </Main>
                    <div className={classes.videoBackgroundWrapper}>
                        <video
                            className={classes.videoBackground}
                            loop
                            autoPlay
                            src={get(currentCompany, "video.src", "")}
                            muted />
                        <div className={classes.shadow} />
                    </div>
                </div>
            </div>
        );
    }
}

Layout.propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    companies: PropTypes.array.isRequired,
    currentCompany: PropTypes.object.isRequired,
    changeCompany: PropTypes.func.isRequired,
    sideLoader: PropTypes.bool.isRequired,
};

export default withRouter(withStyles(styles)(Layout));
