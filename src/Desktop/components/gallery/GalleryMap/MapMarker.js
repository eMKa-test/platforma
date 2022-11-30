import React from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Marker, Tooltip } from "react-leaflet";
import "./style.css";
import L from "leaflet";
import styles from "./styles";
import roundIcon from "../../../assets/icons/roundMarker.svg";
import roundIconActive from "../../../assets/icons/roundMarkerActive.svg";

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

const MapMarker = (props) => {
    const [isHover, setIsHover] = React.useState(false);
    const {
        classes, item, onSelectImage, id,
    } = props;

    return (
        <Marker
            icon={isHover ? activeIcon : icon}
            position={[item.gps.lat, item.gps.long]}
            onMouseOver={() => {
                setIsHover(true);
            }}
            onMouseOut={() => {
                setIsHover(false);
            }}
            onClick={() => {
                onSelectImage(id);
            }}>
            <Tooltip>
                <img
                    className={classes.popupTmb}
                    src={item.src.tmb}
                    alt="" />
            </Tooltip>
        </Marker>
    );
};

MapMarker.propTypes = {
    classes: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    onSelectImage: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
};

export default withStyles(styles)(MapMarker);
