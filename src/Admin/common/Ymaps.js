import React from "react";
import * as PropTypes from "prop-types";
import { YMaps as YandexMaps, Map, Placemark } from "react-yandex-maps";
import get from "lodash/get";

const defaultMapState = {
    // type: 'yandex#publicMapHybrid',
    zoom: 17,
    controls: [],
};

let newCoords = {};
const onGeometryChange = (ev) => {
    newCoords = get(ev, "originalEvent.target.geometry._coordinates", {});
};

// eslint-disable-next-line
const getCoords = center => center ? Object.values(center).map(val => val) : [55.76, 37.64];

const Ymaps = ({ marker, onNewCoords }) => {
    const mapState = { ...defaultMapState, center: getCoords(marker) };
    return (
        <YandexMaps>
            <Map state={mapState}
                width="100%"
                height={208}>
                <Placemark
                    onGeometryChange={onGeometryChange}
                    geometry={{
                        coordinates: getCoords(marker),
                    }}
                    options={{
                        preset: "islands#icon",
                        iconColor: "#BEA67C",
                        draggable: true,
                    }}/>
            </Map>
        </YandexMaps>
    );
};

Ymaps.propTypes = {
    marker: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        long: PropTypes.number.isRequired,
    }),
    onNewCoords: PropTypes.func.isRequired,
};

export default Ymaps;
