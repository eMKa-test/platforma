import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import * as PropTypes from "prop-types";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import galleryJSS, { styles } from "./styles";

class VideoControls extends Component {
    handleChange = (value) => {
        if (typeof this.props.onTimeChange === "function") {
            this.props.onTimeChange(value);
        }
    };

    handleVolume = (value) => {
        if (typeof this.props.onVolumeChange === "function") {
            this.props.onVolumeChange(value);
        }
    };

    showTime = (time) => {
        let temp = 0;
        let hours = 0;
        let minutes = 0;
        let seconds = 0;

        if (time >= 3600) {
            temp = time / 3600;
            hours = Math.trunc(temp);
        }

        if (time >= 60) {
            temp = (time - (hours * 3600)) / 60;
            minutes = Math.trunc(temp);
            temp = hours * 3600 + minutes * 60;
            seconds = Math.trunc(time - temp);
            if (minutes < 10 && hours > 0) {
                minutes = `0${minutes}`;
            }
        }

        if (time < 60) {
            seconds = Math.trunc(time);
        }

        if (seconds < 10) {
            seconds = `0${seconds}`;
        }

        if (hours === 0) {
            hours = "";
        } else {
            hours = `${hours}:`;
        }

        return `${hours}${minutes}:${seconds}`;
    };

    render() {
        const {
            currentTime, duration, paused, classes, handlePlay, handlePause, volume,
        } = this.props;

        return (
            <div className={classes.fullscreenVideoControls}>
                <button
                    className={classNames(
                        paused ? "icon-fontello-1-play" : "icon-fontello-1-pause",
                        classes.fullscreenOptionsMenuButton,
                        classes.fullscreenOptionsMenuItem,
                    )}
                    type="button"
                    onClick={paused ? handlePlay : handlePause} />
                <span
                    className={
                        classNames(classes.fullscreenOptionsMenuTimer, classes.fullscreenOptionsMenuItem)
                    }>
                    {`${this.showTime(currentTime)} / ${this.showTime(duration)}`}
                </span>
                <Slider
                    className={classNames(classes.fullscreenOptionsMenuItem, classes.fullscreenOptionsMenuProgressBar)}
                    railStyle={styles.railStyle}
                    trackStyle={styles.trackStyle}
                    handleStyle={styles.handleStyle}
                    value={currentTime}
                    max={duration}
                    step={0.01}
                    onChange={this.handleChange} />
                <span
                    className={classNames(
                        classes.fullscreenOptionsMenuItem,
                        classes.fullscreenOptionsMenuVolumeWrapper,
                    )}>
                    <Slider
                        className={classes.fullscreenOptionsMenuVolume}
                        railStyle={styles.railStyle}
                        trackStyle={styles.trackStyle}
                        handleStyle={styles.handleStyle}
                        value={volume}
                        max={1}
                        step={0.05}
                        onChange={this.handleVolume} />
                </span>
            </div>
        );
    }
}

VideoControls.propTypes = {
    classes: PropTypes.object,
    currentTime: PropTypes.number,
    duration: PropTypes.number,
    paused: PropTypes.bool,
    handlePlay: PropTypes.func,
    handlePause: PropTypes.func,
    onTimeChange: PropTypes.func,
    onVolumeChange: PropTypes.func,
    volume: PropTypes.number,
};

export default withStyles(galleryJSS)(VideoControls);
