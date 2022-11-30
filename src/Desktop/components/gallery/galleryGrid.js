import React from "react";
import * as PropTypes from "prop-types";
import compose from "recompose/compose";
import memoize from "lodash/memoize";
import { withStyles } from "@material-ui/core/styles";
import withWidth from "@material-ui/core/withWidth";
import RSC from "react-scrollbars-custom";

import galleryJSS from "./styles";
import ThumbnailCard from "./thumbnailCard";

const handleWidth = memoize((width) => {
    switch (width) {
        case "xs":
        case "sm":
            return "50%";
        case "md":
            return "33.3%";
        case "lg":
            return "25%";
        case "xl":
        default:
            return "20%";
    }
});

function GalleryGrid(props) {
    const {
        classes,
        width,
        images,
        onSelectImage,
    } = props;
    return (
        <RSC
            trackYProps={{ className: classes.trackY }}
            thumbYProps={{ className: classes.thumbY }}>
            <div className={classes.grid}>
                {images.map((tile, i) => (
                    <ThumbnailCard
                        key={tile.id}
                        onSelectImage={onSelectImage}
                        idx={i}
                        width={handleWidth(width)}
                        item={tile} />
                ))}
            </div>
        </RSC>
    );
}

GalleryGrid.propTypes = {
    classes: PropTypes.object.isRequired,
    width: PropTypes.string.isRequired,
    images: PropTypes.array.isRequired,
    onSelectImage: PropTypes.func.isRequired,
};

export default compose(
    withStyles(galleryJSS),
    withWidth(),
)(React.memo(GalleryGrid));
