import React from "react";
import * as PropTypes from "prop-types";
import { ImageOverlay, LayerGroup } from "react-leaflet";
import upgt from "../../../assets/mapLayers/upgt/201903ks-final.jpg";
import mtr from "../../../assets/mapLayers/mtr/201903mtr.jpg";
import vzg from "../../../assets/mapLayers/vzg/201903vzg.jpg";
import urng from "../../../assets/mapLayers/urng/stitched-rotated.png";

const Imglayers = ({ bound, line }) => {
    let currentLine;
    switch (line) {
        case "1": currentLine = upgt; break;
        case "2": currentLine = mtr; break;
        case "3": currentLine = vzg; break;
        case "25": currentLine = urng; break;
        default: return null;
    }
    return (
        <LayerGroup>
            <ImageOverlay
                url={currentLine}
                bounds={bound} />
        </LayerGroup>
    );
};

Imglayers.propTypes = {
    bound: PropTypes.array,
    line: PropTypes.string,
};

export default Imglayers;
