import React, { Component, Fragment } from "react";
import * as PropTypes from "prop-types";
import L from "leaflet";
import {
    Map, TileLayer, Marker, ImageOverlay, LayerGroup, Tooltip,
} from "react-leaflet";
import {
    LAYERS_GPS_UPGT, LAYERS_GPS_MTR, LAYERS_GPS_VZG, STREET_TILE, LAYERS_GPS_URNG,
} from "../../../Desktop/components/mapLayer/constants";
import upgt from "../../../assets/mapLayers/upgt/201903ks-final.jpg";
import mtr from "../../../assets/mapLayers/mtr/201903mtr.jpg";
import vzg from "../../../assets/mapLayers/vzg/201903vzg.jpg";
import urng from "../../../assets/mapLayers/urng/stitched-rotated.png";

const Imglayers = ({ bound, url }) => (
    <LayerGroup>
        <ImageOverlay
            url={url}
            bounds={bound} />
    </LayerGroup>
);

const customMarker = L.divIcon({
    html: "<i class=\"fa fa-circle d-block text-warning\" style=\"font-size: 1.3rem\" />",
    className: "marker-custom",
    iconSize: L.point(15, 20, true),
});

const submitMarkerIcon = L.divIcon({
    html: "<i class=\"fa fa-dot-circle-o d-block text-danger\" style=\"font-size: 1.3rem\" />",
    className: "marker-custom",
    iconSize: L.point(15, 20, true),
});

const sublineMarkerIcon = L.divIcon({
    html: "<i class=\"fa fa-dot-circle-o d-block text-info\" style=\"font-size: 1.3rem\" />",
    className: "marker-custom",
    iconSize: L.point(15, 20, true),
});

const sublineMarkerIconSelected = L.divIcon({
    html: "<i class=\"fa fa-dot-circle-o d-block text-warning\" style=\"font-size: 1.3rem\" />",
    className: "marker-custom",
    iconSize: L.point(15, 20, true),
});

class SublineMap extends Component {
    static propTypes = {
        line: PropTypes.object.isRequired,
        setCenterForSubline: PropTypes.func.isRequired,
        onSubmitSublineCenter: PropTypes.func.isRequired,
        sublinesList: PropTypes.array.isRequired,
        selectedSubline: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            viewPort: { center: [59.87553, 30.500401], zoom: 14 },
            sublineMarkers: [],
            marker: null,
            submitMarker: null,
        };
    }

    cancel = [];

    componentDidMount() {
        this.mountData();
    }

    mountData = () => {
        const { line, sublinesList } = this.props;
        const sublineMarkers = sublinesList.filter(({ gps }) => gps).map(({ gps, id }) => ({ id, gps: Object.values(gps) }));
        this.setState({ viewPort: { center: Object.values(line.gps), zoom: 14 }, sublineMarkers });
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

    setSublineGPS = (e) => {
        const { latlng } = e;
        this.setState({ submitMarker: Object.values(latlng) });
    };

    move = ({ latlng }) => {
        this.setState({ marker: Object.values(latlng) });
    };

    renderPreMarker = (marker) => {
        return (
            <Marker
                onClick={this.setSublineGPS}
                icon={customMarker}
                position={marker}>
                <Tooltip>
                    <div>
                        <p className="m-0 p-0">
                            {`ш: ${marker[0].toFixed(5)}...`}
                        </p>
                        <p className="m-0 p-0">
                            {`д: ${marker[1].toFixed(5)}...`}
                        </p>
                    </div>
                </Tooltip>
            </Marker>
        );
    };

    renderSubmitMarker = (marker) => {
        return (
            <Marker
                className="header-subline-map-marker"
                onClick={this.setSublineGPS}
                icon={submitMarkerIcon}
                position={marker} />
        );
    };

    renderSublineMarkers = () => this.state.sublineMarkers.map((marker) => (
        <Marker
            key={marker.id}
            className="header-subline-map-sublines marker"
            icon={marker.id === this.props.selectedSubline.id ? sublineMarkerIconSelected : sublineMarkerIcon}
            position={marker.gps} />
    ));

    onCancel = () => {
        this.setState({ submitMarker: null });
    };

    render() {
        const {
            viewPort, marker, submitMarker, sublineMarkers,
        } = this.state;
        const { onSubmitSublineCenter } = this.props;
        return (
            <Map
                zoomControl={false}
                viewport={viewPort}
                onMouseMove={this.move}
                style={{ height: "100%", position: "relative" }}
                maxZoom={20}>
                {
                    marker && !submitMarker && this.renderPreMarker(marker)
                }
                {
                    submitMarker && this.renderSubmitMarker(submitMarker)
                }
                <TileLayer url={`${STREET_TILE}`} />
                {this.renderLayers()}
                {
                    submitMarker && (
                        <div className="header-subline-map_submit-panel">
                            <button
                                type="button"
                                onClick={this.onCancel}>
                                Отмена
                            </button>
                            <button
                                type="button"
                                onClick={onSubmitSublineCenter(submitMarker, this.onCancel)}>
                                Ok
                            </button>
                        </div>
                    )
                }
                {
                    sublineMarkers.length > 0 && this.renderSublineMarkers()
                }
                <button
                    className="header-subline-map-container__close-map"
                    type="button"
                    onClick={this.props.setCenterForSubline(null, false)}>
                    X
                </button>
            </Map>
        );
    }
}

export default SublineMap;
