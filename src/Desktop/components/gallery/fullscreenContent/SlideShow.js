import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import * as PropTypes from "prop-types";
import galleryJSS from "../styles";

const SlideShow = (props) => {
    const {
        classes, paused, handleSlideShow, currentSlide, lastSlide,
    } = props;

    return (
        <div className={classes.fullscreenSlideShow}>
            <button
                className={classNames(
                    paused ? "icon-fontello-1-play" : "icon-fontello-1-pause",
                    classes.fullscreenOptionsMenuButton,
                )}
                type="button"
                onClick={() => { handleSlideShow(paused); }} />
            <span className={classes.fullscreenSlideShowCount}>
                <span>
                    {`${currentSlide}`}
                </span>
                <span>
                    {`/${lastSlide}`}
                </span>
            </span>
        </div>
    );
};

SlideShow.propTypes = {
    classes: PropTypes.object,
    paused: PropTypes.bool,
    handleSlideShow: PropTypes.func,
    currentSlide: PropTypes.number,
    lastSlide: PropTypes.number,
};

export default withStyles(galleryJSS)(SlideShow);
