import React, { Component } from "react";
import * as PropTypes from "prop-types";
import L from "leaflet";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import {
    Map, TileLayer, Marker, LayersControl, Polyline,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";
import { goldColorHigh } from "../../common/constants";
import axios from "../../common/axios";
import "react-leaflet-markercluster/dist/styles.min.css";
import "leaflet/dist/leaflet.css";
import {
    ACCESS_TOKEN_LMAPS,
    SATELLITE_TILE,
    LAYERS_GPS_UPGT,
    LAYERS_GPS_MTR,
    LAYERS_GPS_VZG,
    LAYERS_GPS_URNG,
    ZOOM_MARKER_RULE,
    WORM_ON_TABS,
} from "./constants";
import Imglayers from "./Layers";
import Schemelayers from "./Scheme";
import "./style.css";
import styles from "./styles";
import roundIcon from "../../assets/icons/roundMarker.svg";
import roundIconActive from "../../assets/icons/roundMarkerActive.svg";
import markerIcon from "../../assets/icons/geoIcon.png";
import markerIconActive from "../../assets/icons/geoActiveIcon.png";
import metrikaEvents, { MAP_CHANGE_LOCATION, MAP_OPEN } from "../../../common/Metrika";

const { Overlay } = LayersControl;

const iconMarker = L.icon({
    iconUrl: markerIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -25],
    tooltipAnchor: [20, -30],
});

const iconMarkerActive = L.icon({
    iconUrl: markerIconActive,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -25],
    tooltipAnchor: [20, -30],
});

const icon = L.icon({
    iconUrl: roundIcon,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -25],
    tooltipAnchor: [15, -30],
});

const activeIcon = L.icon({
    iconUrl: roundIconActive,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -25],
    tooltipAnchor: [15, -30],
});

const clusterIcon = (cluster) => L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: "marker-cluster-custom",
    iconSize: L.point(60, 60, true),
});

class MapLayer extends Component {
    static propTypes = {
        zoom: PropTypes.number,
        center: PropTypes.shape({
            lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            long: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        }),
        placemarks: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            description: PropTypes.string,
            gps: PropTypes.shape({
                lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                long: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            }),
        })),
        onPlacemarkClick: PropTypes.func,
        fullScreenContent: PropTypes.func,
        activeMark: PropTypes.number,
        screenX: PropTypes.number,
        objectID: PropTypes.string,
        lineID: PropTypes.string,
        classes: PropTypes.object,
        params: PropTypes.object,
        showMap: PropTypes.func,
        modeMap: PropTypes.bool,
        history: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            contentGeo: [],
            defViewport: { center: [59.87553, 30.500401], zoom: 10 },
            bound: [[59.87553, 30.500401]],
            typeOfContent: null,
            polyLines: [],
            allLines: [],
            indexID: null,
            startZoom: 0,
            currentZoom: 0,
        };
    }

    cancel = [];

    componentDidMount() {
        this.fetchContenData();
    }

    componentDidUpdate(prevProps) {
        const { companySlug, lineID, tab, date } = this.props.params;
        if (lineID) {
            if (prevProps.modeMap !== this.props.modeMap && this.props.modeMap) {
                this.fetchContenData();
                metrikaEvents.emit(MAP_OPEN, { companySlug, tab });
            }
            if (this.props.modeMap && (prevProps.params.date !== date || prevProps.params.tab !== tab)) {
                this.fetchContenData();
            }
            if (prevProps.params.lineID !== lineID) {
                this.fetchContenData();
            }
        }
    }

    componentWillUnmount() {
        this.cancel.forEach((cancel) => {
            if (typeof cancel === "function") {
                cancel();
            }
        });
    }

    fetchContenData = () => {
        const { tab, contentID } = this.props.params;
        if (tab === "cameras") {
            this.setState({
                contentGeo: [],
                defViewport: { center: [59.87553, 30.500401], zoom: 10 },
                bound: [[59.87553, 30.500401]],
                polyLines: [],
                indexID: null,
            });
            return null;
        }
        this.fetchData(this.props.params).then((data) => {
            if (data && data.payload) {
                const { payload } = data;
                if (payload.length > 0) {
                    const bound = [];
                    const result = payload.filter((geo) => geo.gps !== null).reduce((acc, cur, i) => {
                        if (!Object.values(cur.gps).includes(null)) {
                            bound.push(Object.values(cur.gps));
                            acc[i] = {
                                id: cur.id,
                                gps: Object.values(cur.gps),
                                description: cur.description,
                                src: cur.src,
                                type: cur.type,
                            };
                        }
                        return acc;
                    }, []);
                    if (result.length > 0) {
                        this.setState({
                            contentGeo: result,
                            bound: bound.length > 1 ? bound : [Object.values(result[0].gps)],
                            polyLines: bound.length > 1 ? bound : [],
                            indexID: contentID,
                        });
                    } else {
                        this.setState({
                            contentGeo: [],
                            defViewport: { center: [59.87553, 30.500401], zoom: 10 },
                            bound: [[59.87553, 30.500401]],
                            polyLines: [],
                            indexID: null,
                        });
                    }
                } else {
                    this.setState({
                        contentGeo: [],
                        defViewport: { center: [59.87553, 30.500401], zoom: 10 },
                        bound: [[59.87553, 30.500401]],
                        polyLines: [],
                        indexID: null,
                    });
                }
            }
        }).catch((e) => console.error(e));
        return null;
    };

    async fetchData({ lineID, tab, date }) {
        const url = `/user/api/lines/${lineID}/content/${tab}`;
        const params = { dateFrom: date };
        const [cancel, promise] = axios("get", url, params, true);
        this.cancel.push(cancel);
        return promise;
    }

    handleClick = (id) => {
        const { history, showMap, params: { companySlug, lineID, tab, date } } = this.props;
        const url = `/${companySlug}/content/${lineID}/${tab}/${date}/${id}`;
        history.replace(url);
        showMap(false);
        metrikaEvents.emit(MAP_CHANGE_LOCATION, { companySlug, tab });
    };

    renderMarkers = (contentID) => {
        const { contentGeo } = this.state;
        const id = Number(contentID);
        return contentGeo.map((geo) => (
            <Marker
                key={geo.id}
                icon={id === geo.id ? activeIcon : icon}
                position={geo.gps}
                onClick={() => this.handleClick(geo.id)} />
        ));
    };

    renderLayers = () => {
        const { lineID } = this.props.params;
        let layerGPS;
        switch (lineID) {
            case "1": layerGPS = LAYERS_GPS_UPGT; break;
            case "2": layerGPS = LAYERS_GPS_MTR; break;
            case "3": layerGPS = LAYERS_GPS_VZG; break;
            case "25": layerGPS = LAYERS_GPS_URNG; break;
            default: return null;
        }
        return (
            <LayersControl
                collapsed={false}
                position="topleft">
                <Overlay
                    name="Фото"
                    checked>
                    <Imglayers
                        bound={layerGPS}
                        line={lineID} />
                </Overlay>
                {lineID === "1" && (
                    <Overlay name="Схема">
                        <Schemelayers
                            bound={layerGPS} />
                    </Overlay>
                )}
            </LayersControl>
        );
    };

    zoomObserve = ({ target }) => {
        const curZ = target.getZoom();
        this.setState({
            currentZoom: curZ,
        });
    };

    startMap = ({ target }) => {
        this.setState({
            startZoom: target._tileZoom,
        });
    };

    checkRenderClusterMarks = ({ startZoom, currentZoom }) => {
        if (currentZoom === 0) {
            return startZoom >= ZOOM_MARKER_RULE;
        }
        return currentZoom >= ZOOM_MARKER_RULE;
    };

    zoomFromCluster = (cluster) => {
        cluster.unspiderfy();
    };

    getBoundView = (e, bound) => {
        e.target._map.flyToBounds(
            bound,
            {
                duration: 0.8,
                easeLinearity: 0.2,
            },
        );
    };

    // До первой необходимости
    renderMarkerClusters = (contentGeo, contentID) => (
        <MarkerClusterGroup
            onClusterClick={this.zoomFromCluster}
            disableClusteringAtZoom={19}
            zoomToBoundsOnClick
            iconCreateFunction={clusterIcon}
            polygonOptions={styles.polygons}>
            <React.Fragment>
                {
                    contentGeo.length > 0 &&
                    this.checkRenderClusterMarks(this.state) && this.renderMarkers(contentID)
                }
            </React.Fragment>
        </MarkerClusterGroup>
    );

    filterMarkerView = (tab, polyLines, contentGeo, contentID, bound) => {
        if (WORM_ON_TABS.includes(tab)) {
            return polyLines.length > 0 && (
                <Polyline
                    className="desktop__polyline"
                    onClick={(e) => this.getBoundView(e, bound)}
                    weight="6"
                    color={goldColorHigh}
                    positions={polyLines} />
            );
        }
        return contentGeo.map((geo) => (
            <Marker
                key={geo.id}
                icon={Number(contentID) === geo.id ? activeIcon : icon}
                position={geo.gps}
                onClick={() => this.handleClick(geo.id)} />
        ));
    };

    render() {
        const {
            contentGeo, bound, polyLines,
        } = this.state;
        const {
            classes, modeMap, showMap, params: { contentID, tab },
        } = this.props;
        const initView = bound.length > 1 ? { bounds: bound } : { center: bound[0], zoom: 16 };
        return (
            <React.Fragment>
                <Slide
                    direction="left"
                    in={modeMap}
                    mountOnEnter
                    unmountOnExit>
                    <div className={classes.mapLayerContainer}>
                        <Map
                            {...initView}
                            className={classes.mapLayer}
                            onZoom={(e) => this.zoomObserve(e)}
                            zoomDelta={0.5}
                            zoomSnap={0.2}
                            zoomControl={false}
                            maxZoom={20}
                            doubleClickZoom>
                            <TileLayer
                                onLoad={(e) => this.startMap(e)}
                                url={`${SATELLITE_TILE}${ACCESS_TOKEN_LMAPS}`} />
                            {
                                this.renderLayers()
                            }
                            {
                                contentGeo.length > 0 &&
                                this.checkRenderClusterMarks(this.state) && this.renderMarkers(contentID)
                            }
                            {
                                this.filterMarkerView(tab, polyLines, contentGeo, contentID, bound)
                            }
                            <button
                                type="button"
                                onClick={() => showMap(false)}
                                className={classes.closeMapButton}>
                                <CloseIcon color="secondary" />
                            </button>
                        </Map>
                    </div>
                </Slide>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(MapLayer));
