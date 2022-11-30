import React from "react";
import * as PropTypes from "prop-types";
import { ImageOverlay, LayerGroup } from "react-leaflet";
import upgt from "../../../assets/mapLayers/upgt/upgt_gibrid_1118_3.png";

const Imglay = ({ bound }) => (
    <LayerGroup>
        <ImageOverlay
            url={upgt}
            bounds={bound} />
    </LayerGroup>
);

Imglay.propTypes = {
    bound: PropTypes.array,
    line: PropTypes.string,
};

export default Imglay;
