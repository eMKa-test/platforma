import React from "react";
import * as PropTypes from "prop-types";
import { withRouter, Switch, Route } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import {
    CONTENT_TABS_ROUTES,
    PANORAMA_ROUTES,
    CAMERAS_TABS_ROUTES,
    AEROPANORAMA_ROUTES,
    AERIAL_ROUTES,
    TIMELAPSE_ROUTES,
    NOMATCH_ROUTES_V2,
    MODEL_ROUTE,
} from "../../router/routePaths";
import styles from "./styles";
import Spinner from "../../components/spinner";
import { WindowSizeConsumer } from "../../providers/WindowSize";
import { CONTENT } from "../../../constants";
import { MapActivityConsumer } from "../../providers/MapActivity";

const NoTabs = React.lazy(() => import("../../components/noTabs"));
const Cameras = React.lazy(() => import("../../components/camerasTab"));
const ContentTab = React.lazy(() => import("../../components/contentTab"));
const Gallery = React.lazy(() => import("../../components/gallery"));
const Panorama = React.lazy(() => import("../../../Panorama"));
const AeroPanorama = React.lazy(() => import("../../../PanoramaAero/container"));
const Model = React.lazy(() => import("../../components/model"));

const TabView = ({
    classes, location, route, ...other
}) => (
    <React.Suspense fallback={<Spinner />}>
        <div
            id="mainTabView"
            className={classes.mainTabViewContainer}>
            <WindowSizeConsumer>
                {({ screenX, screenY }) => (
                    <Switch>
                        <Route path={PANORAMA_ROUTES}>
                            <Panorama
                                {...other}
                                routeParams={route} />
                        </Route>
                        <Route path={AEROPANORAMA_ROUTES}>
                            <AeroPanorama
                                {...other}
                                routeParams={route} />
                        </Route>
                        <Route path={CAMERAS_TABS_ROUTES}>
                            <Cameras
                                screenX={screenX}
                                screenY={screenY} />
                        </Route>
                        <Route path={AERIAL_ROUTES}>
                            <ContentTab
                                {...other}
                                screenX={screenX}
                                screenY={screenY}
                                routeParams={route} />
                        </Route>
                        <Route path={TIMELAPSE_ROUTES}>
                            <ContentTab
                                {...other}
                                screenX={screenX}
                                screenY={screenY}
                                routeParams={route} />
                        </Route>
                        <Route path={MODEL_ROUTE}>
                            <Model
                                {...other}
                                screenX={screenX}
                                screenY={screenY}
                                routeParams={route} />
                        </Route>
                        <Route path={NOMATCH_ROUTES_V2}>
                            <NoTabs />
                        </Route>
                        <Route path={CONTENT_TABS_ROUTES}>
                            <MapActivityConsumer>
                                { (value) => (
                                    <Gallery
                                        {...other}
                                        {...value}
                                        isContent
                                        contentType={CONTENT}
                                        routeParams={route} />
                                )}
                            </MapActivityConsumer>
                        </Route>
                    </Switch>
                )}
            </WindowSizeConsumer>
        </div>
    </React.Suspense>
);

TabView.propTypes = {
    classes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    route: PropTypes.object,
};

export default withRouter(withStyles(styles)(TabView));
