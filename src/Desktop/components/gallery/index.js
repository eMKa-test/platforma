import React, { Component } from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import galleryJSS from "./styles";
import FullscreenContent from "./fullscreenContent";
import GalleryGrid from "./galleryGrid";
import CloseBtn from "../../common/buttons/close";
import GalleryMap from "./GalleryMap";
import ErrorBoundary from "../../../common/ErrorBoundary";

class Gallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idx: null,
            isFullscreen: false,
        };
    }

    elementRef = React.createRef();

    componentDidMount() {
        document.addEventListener("webkitfullscreenchange", this.onFullscreenChange);
        document.addEventListener("fullscreenchange", this.onFullscreenChange);
    }

    componentWillUnmount() {
        document.removeEventListener("webkitfullscreenchange", this.onFullscreenChange);
        document.removeEventListener("fullscreenchange", this.onFullscreenChange);
    }

    onSelectImage = (index) => {
        const { showMap } = this.props;
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

        this.setState({
            idx: index,
            isFullscreen: true,
        });

        if (showMap) {
            showMap(false);
        }
    };

    onFullscreenChange = () => {
        if ((document.fullscreenElement === null || document.webkitFullscreenElement === null) && this.state.isFullscreen) {
            this.setState({ isFullscreen: false });
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
        this.setState({
            isFullscreen: false,
        });
    };

    render() {
        const { media } = this.props;
        if (!Array.isArray(media)) {
            return null;
        }
        const {
            classes, contentType, isContent, isStream, modeMap,
        } = this.props;
        const { idx, isFullscreen } = this.state;
        return (
            <ErrorBoundary>
                <div
                    className={classNames(classes.root, {
                        [classes.isContent]: isContent,
                        [classes.isStream]: isStream,
                    })}>
                    <GalleryGrid
                        onSelectImage={this.onSelectImage}
                        images={media} />
                    <div ref={this.elementRef}>
                        {isFullscreen ? (
                            <div>
                                <CloseBtn onClick={this.handleClose} />
                                <FullscreenContent
                                    idx={idx}
                                    content={media}
                                    contentType={contentType} />
                            </div>
                        ) : null}
                    </div>
                    {
                        isContent && (
                            <GalleryMap
                                modeMap={modeMap}
                                onSelectImage={this.onSelectImage}
                                content={media} />
                        )
                    }
                </div>
            </ErrorBoundary>
        );
    }
}

Gallery.propTypes = {
    classes: PropTypes.object.isRequired,
    media: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    contentType: PropTypes.string,
    isContent: PropTypes.bool,
    isStream: PropTypes.bool,
    modeMap: PropTypes.bool,
    showMap: PropTypes.func,
};

export default withStyles(galleryJSS)(Gallery);
