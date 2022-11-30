import React from "react";
import * as PropTypes from "prop-types";

function createStyle(style = {}, maxWidth, width) {
    if (maxWidth || width) {
        return { ...style, maxWidth, width };
    }
    return style;
}

const callback = () => {};

const VideoPlayer = React.forwardRef((props, ref) => {
    const {
        src,
        tmb = "",
        style = null,
        preload = "none",
        className = "",
        loop = false,
        maxWidth,
        width,
        autoPlay = false,
        controls = true,
        onCanPlay = callback,
        onPause = callback,
        onPlaying = callback,
        onTimeUpdate = callback,
        onLoadedMetadata = callback,
        onEnded = callback,
        onClick = callback,
    } = props;
    return (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
            className={className}
            style={createStyle(style, maxWidth, width)}
            autoPlay={autoPlay}
            onCanPlay={onCanPlay}
            onPause={onPause}
            onPlaying={onPlaying}
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={onLoadedMetadata}
            onEnded={onEnded}
            onClick={onClick}
            loop={loop}
            ref={ref}
            controls={controls}
            preload={preload}
            src={src}
            poster={tmb}
            disablePictureInPicture="disablepictureinpicture"
            controlsList="nodownload noremoteplayback">
                Ваш браузер не поддерживает видео
        </video>
    );
});

VideoPlayer.propTypes = {
    src: PropTypes.string,
    tmb: PropTypes.string,
    style: PropTypes.object,
    preload: PropTypes.oneOf(["none", "metadata"]),
    className: PropTypes.string,
    autoPlay: PropTypes.bool,
    controls: PropTypes.bool,
    loop: PropTypes.bool,
    maxWidth: PropTypes.string,
    width: PropTypes.string,
    onCanPlay: PropTypes.func,
    onPause: PropTypes.func,
    onPlaying: PropTypes.func,
    onTimeUpdate: PropTypes.func,
    onLoadedMetadata: PropTypes.func,
    onEnded: PropTypes.func,
    onClick: PropTypes.func,
};

export default VideoPlayer;
