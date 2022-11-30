import React, { Component } from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
import {
    Map, TileLayer,
} from "react-leaflet";
import { ACCESS_TOKEN_LMAPS, SATELLITE_TILE } from "../../mapLayer/constants";
import "react-leaflet-markercluster/dist/styles.min.css";
import "leaflet/dist/leaflet.css";
import "./style.css";
import styles from "./styles";
import MapMarker from "./MapMarker";

class GalleryMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bound: [[59.87553, 30.500401]],
        };
    }

    componentDidMount() {
        const { content } = this.props;
        const bound = [];
        content.map((item) => {
            if (item.gps !== null) {
                bound.push([item.gps.lat, item.gps.long]);
            }
            return null;
        });
        this.setState({ bound });
    }

    render() {
        const { bound } = this.state;
        const {
            classes, content, onSelectImage, modeMap,
        } = this.props;
        const initView = bound.length > 1 ? { bounds: bound } : { center: bound[0], zoom: 16 };

        return (
            <React.Fragment>
                <div
                    className={classNames(classes.mapLayerContainer,
                        modeMap ? classes.mapLayerContainerVisible : null)}>
                    <Map
                        {...initView}
                        className={classes.mapLayer}
                        zoomDelta={0.5}
                        zoomSnap={0.2}
                        zoomControl={false}
                        maxZoom={17.7}
                        doubleClickZoom>
                        <TileLayer
                            url={`${SATELLITE_TILE}${ACCESS_TOKEN_LMAPS}`} />
                        {
                            content.map((item, id) => {
                                return (
                                    item.gps && (
                                        <MapMarker
                                            key={item.id}
                                            item={item}
                                            onSelectImage={onSelectImage}
                                            id={id} />
                                    )
                                );
                            })
                        }
                    </Map>
                </div>
            </React.Fragment>
        );
    }
}

GalleryMap.propTypes = {
    classes: PropTypes.object.isRequired,
    content: PropTypes.array.isRequired,
    onSelectImage: PropTypes.func.isRequired,
    modeMap: PropTypes.bool.isRequired,
};

export default withRouter(withStyles(styles)(GalleryMap));
