import React from "react";
import * as PropTypes from "prop-types";
import { ImageOverlay, LayerGroup } from "react-leaflet";

const Imglayers = ({ bound, url }) => (
    <LayerGroup>
        <ImageOverlay
            url={url}
            bounds={bound} />
    </LayerGroup>
);

Imglayers.propTypes = {
    bound: PropTypes.array,
    url: PropTypes.string,
};

export default Imglayers;
