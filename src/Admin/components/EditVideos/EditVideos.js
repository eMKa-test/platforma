import React, { Component } from "react";
import * as PropTypes from "prop-types";
import timePassArrow from "../../../assets/icons/timePass arrow.png";
import VideoPlayer from "../../../common/VideoPlayer";

class EditVideos extends Component {
    state = {
        lines: [],
        start: null,
    }

    componentDidMount() {
        document.addEventListener("keydown", this.onKeyPress);
        this.props.getVideoCut(null);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.lines.length !== prevState.lines.length) {
            this.props.getVideoCut(this.state.lines);
        }
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyPress);
    }

    currentVideo = React.createRef();

    onCutTimeStart = () => {
        const curTime = Math.round(this.currentVideo.current.currentTime);
        this.setState({
            start: curTime,
        });
    }

    onCutTimeStop = () => {
        const curTime = Math.round(this.currentVideo.current.currentTime);
        if (this.state.start === null) {
            alert("Не задано начальное время");
            return null;
        }
        if (this.state.start >= curTime) {
            alert("Конечное время не может быть меньше или равна начальному");
            return null;
        }
        const result = [this.state.start, curTime];
        this.setState(
            (state) => ({
                start: null,
                lines: state.lines.concat([result]),
            }),
        );
    }

    removeTimePass = (index) => {
        const result = this.state.lines.filter((el, i) => i !== index);
        this.setState({
            lines: result,
        });
    }

    showTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        const secCorrect = sec < 10 ? `0${sec}` : `${sec}`;
        const time = `${min}:${secCorrect}`;
        return time;
    }

    onKeyPress = (e) => {
        if (e.code === "Space") {
            const el = this.currentVideo.current;
            el.paused ? el.play() : el.pause();
        }
        if (e.key === "i") {
            this.onCutTimeStart();
        }
        if (e.key === "o") {
            this.onCutTimeStop();
        }
    }

    showSetTimePass = (index, pass, start = 0, showInPreview = false) => {
        const el = this.currentVideo.current;
        if (showInPreview) {
            el.currentTime = start;
            return null;
        }
        const { lines } = this.state;
        const selectTime = lines[index][pass];
        el.currentTime = selectTime;
    }

    render() {
        const { video } = this.props;
        const {
            lines, start,
        } = this.state;
        return (
            <div className="modal-edit-aerials mb-2">
                <VideoPlayer
                    ref={this.currentVideo}
                    src={video.src.src} />
                <div className="row no-gutters mt-2 mb-2 modal-edit-aerials_control-edit">
                    <p className="col-2 m-0">
                        Старт:
                        {" "}
                        {
                            start !== null && (
                                <span
                                    title="Перейти"
                                    className="modal-edit-timepass"
                                    onClick={() => this.showSetTimePass(0, 0, start, true)}>
                                    {this.showTime(start)}
                                </span>
                            )
                        }
                    </p>
                    <button
                        className="mr-2 col-3"
                        type="button"
                        onClick={this.onCutTimeStart}>
                        Начало
                    </button>
                    <button
                        className="ml-2 col-3"
                        type="button"
                        onClick={this.onCutTimeStop}>
                        Конец
                    </button>
                </div>
                <div className="modal-edit-cuts-list">
                    {
                        lines.map((line, i) => (
                            <div
                                className="row modal-edit-cut-box h-25 no-gutters d-flex justify-content-between"
                                key={i}>
                                <div className="modal-edit-cut-item col-10">
                                    <span
                                        title="Перейти"
                                        onClick={() => this.showSetTimePass(i, 0)}
                                        className="col-2 text-center modal-edit-timepass">
                                        {this.showTime(line[0])}
                                    </span>
                                    <span
                                        className="col-2 text-center">
                                        <img
                                            src={timePassArrow}
                                            alt="Arrow" />
                                    </span>
                                    <span
                                        title="Перейти"
                                        onClick={() => this.showSetTimePass(i, 1)}
                                        className="col-2 text-center modal-edit-timepass">
                                        {this.showTime(line[1])}
                                    </span>
                                </div>
                                <button
                                    className="col-1"
                                    onClick={() => this.removeTimePass(i)}
                                    type="button">
                                    X
                                </button>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

EditVideos.propTypes = {
    video: PropTypes.object,
    getVideoCut: PropTypes.func,
};

export default EditVideos;
