import React from "react";
import {
    Map, TileLayer, Rectangle, CircleMarker, ImageOverlay, LayerGroup,
} from "react-leaflet";
import upgt from "../assets/mapLayers/upgt/201903ks-final.jpg";
import "./style.css";
import "leaflet/dist/leaflet.css";

const KEY = "https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=grAza93E2976imr6CvJS";


const coordModel = [[59.57010476, 28.23517886], [59.5670175, 28.24540231]];

const CENTER = [59.56856113, 28.240290585];

const LAYERS_GPS_UPGT = [[59.57010476, 28.23517886], [59.5670175, 28.24540231]];

const Imglayers = ({ bound, url }) => (
    <LayerGroup>
        <ImageOverlay
            url={url}
            bounds={bound} />
    </LayerGroup>
);

const start = {
    latitude:  59.57010476,
    longitude: 28.23517886,
};
const end = {
    latitude:  59.57010476,
    longitude: 28.24540231,
};

class MapL extends React.Component {
    getCoords = (e) => {
        this.props.changePoint({ lat: e.latlng.lat, long: e.latlng.lng });
    };

    render() {
        return (
            <div className="map-layer-model">
                <Map
                    onClick={this.getCoords}
                    bounds={coordModel} style={{ height: "100%", position: "relative" }}>
                    <TileLayer url={KEY} />
                    {
                        coordModel.map((coord) => (
                            <CircleMarker key={coord[0]} className="map-layer-model-point" radius={3} center={coord} />
                        ))
                    }
                    <CircleMarker
                        className="map-layer-model-point" radius={3}
                        center={Object.values(start)} />
                    <CircleMarker className="map-layer-model-point" radius={3} center={Object.values(end)} />
                    <CircleMarker className="map-layer-model-point-center" radius={3} center={CENTER} />
                    <Imglayers
                        url={upgt}
                        bound={LAYERS_GPS_UPGT} />
                </Map>
            </div>
        );
    }
}

export default MapL;
