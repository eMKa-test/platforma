import React from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import Slide from "@material-ui/core/Slide";
import Header from "../header";
import styles from "./styles";
import { MapActivityContext } from "../../providers/MapActivity";
import { CalendarActivityContext } from "../../providers/CalendarActivity";
import { ModelActivityContext } from "../../providers/ModelActivity";
import { RightsContext } from "../../providers/Rights";
import ToggleLayers from "./navigateLayer";

const Main = (props) => {
    const { modeMap, showMap } = React.useContext(MapActivityContext);
    const { modeCalendar, showCalendar } = React.useContext(CalendarActivityContext);
    const {
        modeModel, showModel, loadRun, runLoadModel, cacheModel, setCacheModel,
    } = React.useContext(ModelActivityContext);
    const { currentCompany } = React.useContext(RightsContext);
    const {
        children, classes, params, user,
        setShowHeader, showHeader,
        ...other
    } = props;
    return (
        <React.Fragment>
            <Slide
                direction="down"
                in={showHeader}
                onExited={() => {
                    if (!props.mainLoader) {
                        props.history.push(`/${currentCompany.slug}/objects`);
                    }
                }}
                mountOnEnter
                unmountOnExit
                timeout={220}>
                <Header
                    {...other}
                    slug={currentCompany.slug}
                    projects={currentCompany.projects || []}
                    user={user}
                    setShowHeader={setShowHeader}
                    params={params}
                    modeCalendar={modeCalendar}
                    modeMap={modeMap}
                    modeModel={modeModel}
                    loadRun={loadRun}
                    runLoadModel={runLoadModel}
                    showModel={showModel}
                    cacheModel={cacheModel}
                    showCalendar={showCalendar}
                    showMap={showMap}
                    showHeader={showHeader} />
            </Slide>
            <div className={classes.mainsContentWrapper}>
                {children}
                <ToggleLayers
                    setCacheModel={setCacheModel}
                    cacheModel={cacheModel}
                    loadRun={loadRun}
                    runLoadModel={runLoadModel}
                    showModel={showModel}
                    modeModel={modeModel}
                    params={params}
                    currentCompany={currentCompany}
                    modeMap={modeMap}
                    showMap={showMap}
                    pathname={props.location.pathname} />
            </div>
        </React.Fragment>
    );
};

Main.propTypes = {
    history: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    setShowHeader: PropTypes.func.isRequired,
    showHeader: PropTypes.bool.isRequired,
    mainLoader: PropTypes.bool.isRequired,
};

export default withRouter(withStyles(styles)(Main));
