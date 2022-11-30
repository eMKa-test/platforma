import React, { Fragment } from "react";
import PropTypes from "prop-types";
import L from "leaflet";
import {
    Map, TileLayer, Marker,
} from "react-leaflet";
import { getData } from "ContentProvider/fetch";
import { Spinner } from "reactstrap";
import markerIcon from "../../assets/mapIcon/defaultMarker.png";
import markerSelected from "../../assets/mapIcon/editMarker.png";
import "leaflet/dist/leaflet.css";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import {
    LAYERS_GPS_MTR,
    LAYERS_GPS_UPGT, LAYERS_GPS_URNG, LAYERS_GPS_VZG,
    STREET_TILE,
} from "../../../Desktop/components/mapLayer/constants";
import Imglayers from "../LMaps/Layers";
import upgt from "../../../assets/mapLayers/upgt/201903ks-final.jpg";
import mtr from "../../../assets/mapLayers/mtr/201903mtr.jpg";
import vzg from "../../../assets/mapLayers/vzg/201903vzg.jpg";
import urng from "../../../assets/mapLayers/urng/stitched-rotated.png";
import "./style.css";
import {
    getDomCoords,
    checkMapDomCoords,
    collectMarkers,
} from "./helper";
import SublinesContentView from "../../views/Lines/Panorama/SublineContentView";

const customIcon = (icon) => L.divIcon({
    html: `
        <img
            style="width: 100%"
            src="${icon}"
            alt="markerIcon" />
    `,
    className: "marker-custom",
    iconSize: L.point(50, 50, true),
    iconAnchor: [25, 49],
});

function checkTypeNum(type) {
    return typeof type === "number";
}

class SublinesCorrect extends React.Component {
    static propTypes = {
        objectId: PropTypes.number,
        lineId: PropTypes.number,
        dateFrom: PropTypes.string,
        setPanProp: PropTypes.func.isRequired,
        forceMapUpdateCoords: PropTypes.bool.isRequired,
        tabLoader: PropTypes.object.isRequired,
        changeForceMapUpdate: PropTypes.func.isRequired,
        selectedSublineMarkers: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            height: 600,
            bound: [[59.87553, 30.500401]],
            defViewport: { center: [59.87553, 30.500401], zoom: 10 },
            panMarkers: [],
            markersDomCoords: {},
            draggingMap: true,
            selectMarkersMode: false,
            selectMarkersModeMouse: false,
            selectPaneCoords: {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                moveDirX: 1,
                moveDirY: 1,
            },
        };
    }

    selectPane = React.createRef();

    mapDom = React.createRef();

    cancel = [];

    componentDidMount() {
        this.fetchDatas();
        document.addEventListener(("keydown"), this.startKeyListener);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.dateFrom !== this.props.dateFrom) {
            this.fetchDatas();
        }
        if (prevProps.forceMapUpdateCoords !== this.props.forceMapUpdateCoords) {
            this.fetchDatas();
        }
    }

    componentWillUnmount() {
        if (this.cancel.length > 0) {
            this.cancel.forEach((cancel) => {
                if (cancel && typeof cancel === "function") {
                    cancel();
                }
            });
        }
        this.props.setPanProp("selectedSublineMarkers", []);
        document.removeEventListener(("keydown"), this.startKeyListenerForMouseSelect);
        document.removeEventListener(("keydown"), this.startKeyListener);
        document.removeEventListener(("keyup"), this.stopKeyListener);
        this.props.tabLoader.maps(true);
    }

    startKeyListener = (e) => {
        if (e.key === "Alt") {
            document.removeEventListener(("keydown"), this.startKeyListener);
            document.addEventListener(("keydown"), this.startKeyListenerForMouseSelect);
            document.addEventListener(("keyup"), this.stopKeyListener);
        } else if (e.key === "Control") {
            document.removeEventListener(("keydown"), this.startKeyListener);
            this.setState({
                selectMarkersMode: true,
            });
            document.addEventListener(("keyup"), this.stopKeyListener);
        } else {
            this.stopKeyListener();
        }
    };

    stopKeyListener = (e) => {
        if (e && e.key === "Control") {
            document.removeEventListener(("keyup"), this.stopKeyListener);
            this.setState({
                selectMarkersMode: false,
            });
            document.addEventListener(("keydown"), this.startKeyListener);
        } else {
            document.addEventListener(("keydown"), this.startKeyListener);
            document.removeEventListener(("keydown"), this.startKeyListenerForMouseSelect);
        }
    };

    startKeyListenerForMouseSelect = (e) => {
        if (e.key === "a" || e.key === "ф") {
            document.removeEventListener(("keydown"), this.startKeyListener);
            document.removeEventListener(("keydown"), this.startKeyListenerForMouseSelect);
            this.setState({
                selectMarkersModeMouse: true,
                draggingMap: false,
            });
            document.addEventListener(("keyup"), this.stopKeyListener);
        }
    };

    fetchDatas = () => {
        this.props.tabLoader.maps(true);
        const { objectId, lineId, dateFrom } = this.props;
        const url = `/admin/api/projects/${objectId}/lines/${lineId}/content/panorama`;
        const params = { limit: 1000, dateFrom };
        this.fetchData(url, params).then((data) => {
            if (data && data.payload && data.payload.length > 0) {
                const { payload } = data;
                const bound = [];
                const panMarkers = payload.reduce((acc,
                    {
                        id, gps, pointId, subline, sublineId,
                    }) => {
                    if (gps && checkTypeNum(gps.lat) && checkTypeNum(gps.long)) {
                        bound.push(Object.values(gps));
                        acc.push({
                            id, gps, pointId, subline, sublineId,
                        });
                    }
                    return acc;
                }, []);
                this.props.setPanProp("selectedSublineMarkers", []);
                this.setState((state) => ({
                    panMarkers,
                    defViewport: {
                        ...state.defViewport,
                        center: bound[0] || state.defViewport.center,
                    },
                    bound,
                }));
            }
        }).then(() => this.props.tabLoader.maps(false));
        this.props.changeForceMapUpdate(false);
    };

    async fetchData(url, params) {
        try {
            const [promise, cancel] = getData({ url, params }, true);
            this.cancel.push(cancel);
            return promise;
        } catch (e) {
            console.warn("Wrong request in LeafLet Component...", e);
            return [];
        }
    }

    renderLayers = () => (
        <Fragment>
            <Imglayers
                url={upgt}
                bound={LAYERS_GPS_UPGT} />
            <Imglayers
                url={mtr}
                bound={LAYERS_GPS_MTR} />
            <Imglayers
                url={vzg}
                bound={LAYERS_GPS_VZG} />
            <Imglayers
                url={urng}
                bound={LAYERS_GPS_URNG} />
        </Fragment>
    );

    selectMarker = (id) => () => {
        if (this.state.selectMarkersMode) {
            const { setPanProp, selectedSublineMarkers } = this.props;
            setPanProp(
                "selectedSublineMarkers", collectMarkers(selectedSublineMarkers, id),
            );
        }
    };

    renderMarkers = (markers, selectedMarkers) => (
        markers.map((marker) => (
            <Marker
                key={marker.id}
                zIndexOffset={300}
                position={Object.values(marker.gps)}
                onClick={this.selectMarker(marker.id)}
                icon={customIcon(selectedMarkers.includes(marker.id) ? markerSelected : markerIcon)} />
        ))
    );

    getCoordsFromMap = (panMarkers) => {
        if (panMarkers.length === 0) {
            return {};
        }
        return {
            onMouseDown: (e) => {
                const markersDomCoords = checkMapDomCoords(this.mapDom.current, this.state.panMarkers);
                const { left, top } = this.selectPane.current.getBoundingClientRect();
                const beginX = Math.floor(e.clientX - left);
                const beginY = Math.floor(e.clientY - top);
                this.setState((state) => ({
                    markersDomCoords,
                    selectMarkersMode: true,
                    selectPaneCoords: {
                        ...state.selectPaneCoords,
                        x: beginX,
                        y: beginY,
                    },
                }));
            },
            onMouseMove: (e) => {
                const {
                    top,
                    left,
                    width,
                    height,
                } = this.selectPane.current.getBoundingClientRect();
                const { selectPaneCoords: { x, y } } = this.state;
                if (!this.state.selectMarkersMode) {
                    return null;
                }
                const moveDirX = e.clientX - left - x > 0 ? 1 : -1;
                const moveDirY = e.clientY - top - y > 0 ? 1 : -1;
                const newWidth = Math.floor(e.clientX) - left - x;
                const newHeight = Math.floor(e.clientY) - top - y;
                if (newWidth < Math.floor(width) - x - 1 && newWidth > -x && newHeight < Math.floor(height) - y - 1 && newHeight > -y) {
                    this.setState((state) => ({
                        selectPaneCoords: {
                            ...state.selectPaneCoords,
                            width: newWidth * moveDirX,
                            height: newHeight * moveDirY,
                            moveDirX,
                            moveDirY,
                        },
                        selectDomCoords: {
                            x: newWidth * moveDirX + x,
                            y: newHeight * moveDirY + y,
                        },
                    }));
                } else {
                    this.thEndOfHighLight();
                }
            },
            onMouseUp: (e) => {
                if (!this.state.selectMarkersMode) {
                    return null;
                }
                const resultSelectedFromMouse = [];
                this.state.markersDomCoords.forEach((mark) => {
                    if (
                        this.state.selectPaneCoords.x < mark.screenCoords.x &&
                        this.state.selectPaneCoords.y < mark.screenCoords.y &&
                        this.state.selectDomCoords.x > mark.screenCoords.x &&
                        this.state.selectDomCoords.y > mark.screenCoords.y
                    ) {
                        resultSelectedFromMouse.push(mark.id);
                    }
                });
                if (resultSelectedFromMouse.length > 0) {
                    this.props.setPanProp("selectedSublineMarkers", collectMarkers(this.props.selectedSublineMarkers, null, resultSelectedFromMouse));
                }
                this.thEndOfHighLight();
            },
        };
    };

    thEndOfHighLight = () => {
        this.setState({
            selectMarkersMode: false,
            selectMarkersModeMouse: false,
            draggingMap: true,
            selectPaneCoords: {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                moveDirX: 1,
                moveDirY: 1,
            },
        }, this.stopKeyListener);
    };

    render() {
        const {
            bound,
            defViewport,
            height,
            panMarkers,
            draggingMap,
            selectPaneCoords,
        } = this.state;
        const { selectedSublineMarkers, tabLoader } = this.props;
        const initViews = (bound.length > 1)
            ? { bounds: bound }
            : { viewport: defViewport };
        const getCoords = this.getCoordsFromMap(panMarkers);
        const selectPaneParams = this.selectPane.current && this.selectPane.current.getBoundingClientRect();
        return (
            <div>
                <div style={{ position: "relative", height: "600px" }}>
                    <div
                        className={`content-tab-loader__map
                    ${tabLoader.store.loadingMap ? "map-loader_show" : "map-loader_hide"}
                `}>
                        <Spinner
                            type="grow"
                            color="primary" />
                    </div>
                    <SublinesContentView {...this.props} />
                    <Map
                        {...initViews}
                        ref={this.mapDom}
                        style={{ height }}
                        boxZoom={false}
                        zoomSnap={1.4}
                        maxZoom={20}
                        dragging={draggingMap}
                        zoomControl={false}>
                        <TileLayer
                            url={`${STREET_TILE}`} />
                        {
                            this.renderLayers()
                        }
                        {
                            panMarkers.length > 0 && (
                                this.renderMarkers(panMarkers, selectedSublineMarkers)
                            )
                        }
                    </Map>
                    <div
                        {...getCoords}
                        ref={this.selectPane}
                        className={`wrapperMap ${draggingMap ? "wrap_hide" : "wrap_show"}`}>
                        <div
                            className="painter-fill"
                            style={getDomCoords(selectPaneParams, selectPaneCoords)} />
                    </div>
                </div>
            </div>
        );
    }
}

export default SublinesCorrect;
