import React, { Component } from "react";
import throttle from "lodash/throttle";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import * as PropTypes from "prop-types";
import galleryJSS from "./styles";
import VideoControls from "./videoControls";
import OptionsBtn from "../../common/buttons/options";
import metrikaEvents, { DOWNLOAD } from "../../../common/Metrika";
import ShareButton from "../../common/buttons/share";
import SlideShow from "./fullscreenContent/SlideShow";

class OptionsMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clientWidth: document.body.clientWidth,
        };
    }

    throttledEL = throttle(() => this.setSizeViewport(), 133.3);

    componentDidMount() {
        window.addEventListener("resize", this.throttledEL);
    }

    setSizeViewport = () => {
        const { clientWidth } = document.body;
        this.setState({ clientWidth });
    };

    componentWillUnmount() {
        window.removeEventListener("resize", this.throttledEL);
    }

    renderSettingsBar = () => {
        const { type } = this.props;
        if (Array.isArray(type) && type.length < 1) {
            return null;
        }

        const {
            classes, opened, src, mediaType, currentTime, duration, paused, handlePlay, handlePause, onTimeChange,
            volume, onVolumeChange, handleSlideShow, currentSlide, lastSlide,
        } = this.props;

        if (opened) {
            return (
                <React.Fragment>
                    {
                        (type.includes("slideShow") && (mediaType === "IMAGE")) ? (
                            <SlideShow
                                handleSlideShow={handleSlideShow}
                                currentSlide={currentSlide}
                                lastSlide={lastSlide}
                                paused={paused} />
                        ) : null
                    }
                    {
                        (type.includes("videoControls") && (mediaType === "VIDEO")) ? (
                            <VideoControls
                                currentTime={currentTime}
                                duration={duration}
                                paused={paused}
                                handlePlay={() => { handlePlay(mediaType); }}
                                handlePause={() => { handlePause(mediaType); }}
                                onTimeChange={onTimeChange}
                                volume={volume}
                                onVolumeChange={onVolumeChange} />
                        ) : null
                    }
                    {
                        (type.includes("download")) ? (
                            <a
                                href={src}
                                onClick={() => {
                                    metrikaEvents.emit(DOWNLOAD, {
                                        source: src,
                                        mediaType,
                                    });
                                }}
                                download
                                className={classes.fullscreenDownload}>
                                <button
                                    aria-label="Загрузить на компютер"
                                    type="button"
                                    className={classNames(
                                        classes.fullscreenOptionsMenuButton,
                                        classes.fullscreenOptionsMenuDownloadButton,
                                    )}>
                                    <span className="icon-fontello-4-cloud" />
                                </button>
                            </a>
                        ) : null
                    }
                    {
                        (type.includes("share")) ? (
                            <ShareButton
                                top
                                source={src}
                                mediaType={mediaType} />
                        ) : null
                    }
                </React.Fragment>
            );
        }

        return null;
    };

    render() {
        const {
            classes, handleOpen, opened, mediaType,
        } = this.props;

        const { clientWidth } = this.state;

        return (
            <React.Fragment>
                <OptionsBtn onClick={handleOpen} />
                <div
                    className={classNames(
                        classes.fullscreenOptionsMenu,
                        (opened) ? classes.visible : classes.hidden,
                    )}
                    style={{
                        width: (opened && (mediaType === "VIDEO")) ? clientWidth - 20 : null,
                    }}>
                    { this.renderSettingsBar() }
                </div>
            </React.Fragment>
        );
    }
}

OptionsMenu.propTypes = {
    classes: PropTypes.object,
    type: PropTypes.array,
    src: PropTypes.string,
    opened: PropTypes.bool,
    handleOpen: PropTypes.func,
    mediaType: PropTypes.string,
    currentTime: PropTypes.number,
    duration: PropTypes.number,
    paused: PropTypes.bool,
    handlePlay: PropTypes.func,
    handlePause: PropTypes.func,
    onTimeChange: PropTypes.func,
    onVolumeChange: PropTypes.func,
    volume: PropTypes.number,
    handleSlideShow: PropTypes.func,
    currentSlide: PropTypes.number,
    lastSlide: PropTypes.number,
};


export default withStyles(galleryJSS)(OptionsMenu);
