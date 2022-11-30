import React, { Component, Fragment } from "react";
import * as PropTypes from "prop-types";
import { fetchData } from "api";
import { getData } from "ContentProvider/fetch";
import L from "leaflet";
import { GestureHandling } from "leaflet-gesture-handling";
import {
    Map, TileLayer, Marker, Polyline,
} from "react-leaflet";
import {
    FormGroup, Label, Input, Spinner,
} from "reactstrap";
import Imglayers from "./Layers";
import markerIcon from "../../assets/mapIcon/defaultMarker.png";
import markerEdit from "../../assets/mapIcon/editMarker.png";
import "leaflet/dist/leaflet.css";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import "./index.css";
import {
    LAYERS_GPS_UPGT, LAYERS_GPS_MTR, LAYERS_GPS_VZG, STREET_TILE, LAYERS_GPS_URNG,
} from "../../../Desktop/components/mapLayer/constants";
import upgt from "../../../assets/mapLayers/upgt/201903ks-final.jpg";
import mtr from "../../../assets/mapLayers/mtr/201903mtr.jpg";
import vzg from "../../../assets/mapLayers/vzg/201903vzg.jpg";
import urng from "../../../assets/mapLayers/urng/stitched-rotated.png";

import doneSubmit from "../../assets/icons/done.png";
import cancelSubmit from "../../assets/icons/cancel.png";

const statusModel = {
    done: {
        image: doneSubmit,
        color: "#17a217",
    },
    cancel: {
        image: cancelSubmit,
        color: "#e00a0a",
    },
};

const customIcon = (index, icon) => L.divIcon({
    html: `
        <img
            style="width: 100%"
            src="${icon}"
            alt="markerIcon" />
        <p class="admin-marker-index-description ${index ? "marker-index-show" : "marker-index-hide"}">
            ${index}
        </p>
    `,
    className: "marker-custom",
    iconSize: L.point(50, 50, true),
    iconAnchor: [25, 49],
});

function checkTypeNum(type) {
    return typeof type === "number";
}

class Leaflet extends Component {
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
        objectID: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        lineID: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    };

    constructor(props) {
        super(props);
        this.state = {
            height: 600,
            screenWidth: 0,
            bound: [[59.87553, 30.500401]],
            defViewport: { center: [59.87553, 30.500401], zoom: 10 },
            placemarks: [],
            newPosition: {},
            polyLines: [],
            polylineMode: false,
            statusAction: false,
            statusMsg: null,
            changeIs: false,
        };
    }

    cancel = [];

    componentDidMount() {
        this.fetchDatas();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.loadedContent) {
            if (prevProps.dateFrom !== this.props.dateFrom) {
                this.fetchDatas();
            }
            if (prevProps.editMode !== this.props.editMode && !this.props.editMode) {
                this.resetChanges();
            }
            if (prevProps.forceMapUpdateCoords !== this.props.forceMapUpdateCoords) {
                this.fetchDatas();
            }
            if (this.state.statusAction && this.state.statusAction !== prevState.statusAction) {
                setTimeout(() => {
                    this.resetStatusAction();
                }, 1700);
            }
        }
    }

    fetchDatas = (editIs = false) => {
        const {
            objectId, lineId, dateFrom, contentType,
        } = this.props;
        const url = `/admin/api/projects/${objectId}/lines/${lineId}/content/${contentType}`;
        const params = { limit: 1000, dateFrom: dateFrom || "" };
        this.fetchData(url, params).then((data) => {
            if (data && data.payload) {
                const { payload } = data;
                const placemarks = [];
                const polyLines = [];
                payload.forEach((mark) => {
                    placemarks.push({
                        id: mark.id,
                        gps: mark.gps,
                        src: mark.src,
                        description: mark.description,
                    });
                    if (mark.gps && (typeof mark.gps.lat === "number" && typeof mark.gps.long === "number")) {
                        polyLines.push(Object.values(mark.gps));
                    }
                });
                this.setState({ placemarks, polyLines }, () => {
                    if (!editIs) {
                        this.calcCenterObjectsCoords(payload);
                    }
                });
            }
        });
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

    componentWillUnmount() {
        this.resetChanges();
        if (this.cancel.length > 0) {
            this.cancel.forEach((cancel) => {
                if (cancel && typeof cancel === "function") {
                    cancel();
                }
            });
        }
        this.props.tabLoader.maps(true);
    }

    calcCenterObjectsCoords = (placemarks) => {
        const currentBound = [];
        placemarks.forEach((els) => {
            if (!Object.is(els.gps, null)) {
                if (!Object.values(els.gps).includes(null)) {
                    currentBound.push(Object.values(els.gps));
                }
            }
        });
        if (currentBound.length > 1) {
            this.setState({
                bound: currentBound,
                defViewport: { center: { lat: currentBound[0][0], lng: currentBound[0][1] }, zoom: 10 },
            });
        } else if (currentBound.length === 1) {
            this.setState({
                bound: [],
                defViewport: { center: { lat: currentBound[0][0], lng: currentBound[0][1] }, zoom: 10 },
            });
        } else if (currentBound.length === 0) {
            this.setState({
                bound: [],
                defViewport: { center: [59.87553, 30.500401], zoom: 10 },
            });
        }
        this.props.tabLoader.maps(false);
    };

    renderMarks = () => (this.state.placemarks ? this.state.placemarks.map((placemark, i) => (
        (!Object.is(placemark.gps, null) && checkTypeNum(placemark.gps.lat) && checkTypeNum(placemark.gps.long))
            ? (
                <Marker
                    key={placemark.id}
                    draggable={this.props.showMeEditContent === placemark.id}
                    icon={customIcon((this.state.polylineMode ? (i + 1) : ""), this.props.showMeEditContent === placemark.id ? markerEdit : markerIcon)}
                    zIndexOffset={this.props.showMeEditContent === placemark.id ? 300 : 250}
                    position={Object.values(placemark.gps)}
                    onClick={() => this.props.startEditMark(placemark.id, i, placemark)}
                    onDragend={(e) => this.setNewCoord(e, placemark)} />
            )
            : null)) : null);

    setNewCoord = (e, marker) => {
        const newCoord = marker;
        newCoord.gps = { lat: e.target._latlng.lat, long: e.target._latlng.lng };
        const ob = this.props.groups.map((element) => {
            if (element.id === marker.id) {
                element.gps = newCoord.gps;
            }
            return element;
        });
        this.setState({
            newPosition: newCoord,
        });
        this.props.changeEditGroupsMark(ob);
    };

    setMarkerPositionFromMap = (e) => {
        const newCoord = this.props.currentMarkerForEdit;
        newCoord.gps = { lat: e.latlng.lat, long: e.latlng.lng };
        const ob = this.props.groups.map((element) => {
            if (element.id === newCoord.id) {
                element.gps = newCoord.gps;
            }
            return element;
        });
        this.setState({
            newPosition: newCoord,
        });
        this.props.changeEditGroupsMark(ob);
    };

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

    submitNewPosition = () => {
        const {
            objectId, lineId, contentType, groups,
        } = this.props;
        const url = `/admin/api/projects/${objectId}/lines/${lineId}/content/${contentType}`;
        const { newPosition } = this.state;
        if (Object.keys(newPosition).length === 0) {
            this.changeStatusAction("Маркер не изменил положения", false);
            this.setState({ newPosition: {} });
            this.props.setshowMeEditContent(null, null, false);
            return null;
        }
        groups.forEach((el, i) => {
            fetchData({
                url: `${url}/${el.id}`,
                method: "put",
                body: {
                    ...el,
                    description: el.description,
                    gps: el.gps,
                },
            }).then(({ success = false }) => {
                if (success && i === groups.length - 1) {
                    this.resetChanges();
                    this.changeStatusAction("Изменения внесены", true);
                }
            }).catch((e) => {
                alert(e.message);
            });
        });
    };

    resetChanges = () => {
        this.setState({ newPosition: {} }, () => {
            this.props.changeEditGroupsMark([]);
            this.props.setshowMeEditContent(null, null, false);
            this.fetchDatas(true);
        });
    };

    renderPolylines = (lines) => (
        <Polyline
            smoothFactor="1.3"
            className="admin-polyline"
            weight="4"
            positions={lines} />
    );

    showMePolylines = () => this.setState((state) => ({ polylineMode: !state.polylineMode }));

    changeStatusAction = (val, done) => this.setState({ statusAction: true, statusMsg: val, changeIs: done });

    resetStatusAction = () => this.setState({ statusAction: false });

    renderStatusPop = () => {
        const { changeIs, statusAction, statusMsg } = this.state;
        const activeStyle = changeIs ? statusModel.done : statusModel.cancel;
        return (
            <div
                className={`admin-map_status ${statusAction ? "status_show" : "status_hide"}`}>
                <span style={{ color: activeStyle.color }}>
                    {statusMsg}
                </span>
                <img
                    className="map-status_icon"
                    src={activeStyle.image}
                    alt="submitIcon" />
            </div>
        );
    };

    render() {
        const {
            bound, screenWidth, typeOfContent, defViewport, height,
            polyLines, polylineMode,
        } = this.state;
        const {
            editMode, showPreviewPic, contentType, tabLoader,
        } = this.props;
        const initViews = (bound.length > 1) ? { bounds: bound } : { viewport: defViewport };
        const checkState = !(contentType === "image" || contentType === "panorama");
        return (
            <div style={{ position: "relative", height }}>
                <div
                    className={`content-tab-loader__map
                    ${tabLoader.store.loadingMap ? "map-loader_show" : "map-loader_hide"}
                `}>
                    <Spinner
                        type="grow"
                        color="primary" />
                </div>
                <Map
                    {...initViews}
                    onClick={this.setMarkerPositionFromMap}
                    gestureHandling
                    style={{ height: "100%" }}
                    boxZoom={false}
                    zoomSnap={1.4}
                    maxZoom={20}
                    doubleClickZoom={false}>
                    <TileLayer
                        url={`${STREET_TILE}`} />
                    {this.renderLayers()}
                    {this.renderMarks(screenWidth, typeOfContent)}
                    {polylineMode && polyLines.length > 0 && this.renderPolylines(polyLines)}
                </Map>
                {this.renderStatusPop()}
                <div className="submit-new-position">
                    <FormGroup check>
                        <Label check>
                            <Input
                                disabled={checkState}
                                checked={showPreviewPic}
                                onChange={this.props.showMePreviewBox}
                                type="checkbox" />
                            &nbsp;Предпросмотр&nbsp;
                            {contentType === "panorama" && "(Shift)"}
                        </Label>
                    </FormGroup>
                    <FormGroup check>
                        <Label check>
                            <Input
                                checked={polylineMode}
                                onChange={this.showMePolylines}
                                type="checkbox" />
                            &nbsp;Соединить маркеры
                        </Label>
                    </FormGroup>
                    <button
                        style={{ margin: "6px 0" }}
                        disabled={editMode ? 0 : true}
                        onClick={this.resetChanges}
                        type="button">
                        Отмена изменений (Esc)
                    </button>
                    <button
                        disabled={editMode ? 0 : true}
                        onClick={this.submitNewPosition}
                        type="button">
                        Сохранить
                    </button>
                </div>
            </div>
        );
    }
}

export default Leaflet;
