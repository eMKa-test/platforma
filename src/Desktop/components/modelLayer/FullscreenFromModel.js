import React, { Component } from "react";
import * as PropTypes from "prop-types";
import CloseBtn from "../../common/buttons/close";
import FullscreenContent from "../gallery/fullscreenContent";

class FullscreenFromModel extends Component {
    elementRef = React.createRef();

    componentDidMount() {
        document.addEventListener("webkitfullscreenchange", this.onFullscreenChange);
        document.addEventListener("fullscreenchange", this.onFullscreenChange);
        if (this.elementRef.current.webkitRequestFullscreen) {
            this.elementRef.current.webkitRequestFullscreen();
        } else {
            this.elementRef.current.requestFullscreen()
                .then(() => {
                    // ...
                })
                .catch(() => {
                    // ...
                });
        }
    }

    componentWillUnmount() {
        document.removeEventListener("webkitfullscreenchange", this.onFullscreenChange);
        document.removeEventListener("fullscreenchange", this.onFullscreenChange);
    }

    onFullscreenChange = () => {
        if ((document.fullscreenElement === null || document.webkitFullscreenElement === null)) {
            if (this.props.onClose) {
                this.props.onClose(null);
            }
        }
    };

    handleClose = () => {
        if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else {
            document.exitFullscreen()
                .then(() => {
                    // ...
                })
                .catch(() => {
                    // ...
                });
        }
    };

    render() {
        const {
            idx, content, contentType,
        } = this.props;
        return (
            <div ref={this.elementRef}>
                <CloseBtn onClick={this.handleClose} />
                <FullscreenContent
                    idx={idx}
                    content={content}
                    contentType={contentType} />
            </div>
        );
    }
}

FullscreenFromModel.propTypes = {
    idx: PropTypes.number.isRequired,
    content: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    contentType: PropTypes.string,
    onClose: PropTypes.func,
};

export default FullscreenFromModel;
