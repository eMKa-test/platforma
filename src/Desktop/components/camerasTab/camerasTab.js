import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
import unescape from "lodash/unescape";
import Slider from "react-slick/lib";
import { kingCams, tosnoCams } from "./helpers";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./styles";
import Carousel from "../carousel/carousel";
import { sliderSettings } from "../mainSliderSettings/sliderSettings";
import { LINES_WITH_CAMS } from "../../../constants";

let throttlerTimeout;
function throttler(callback) {
    // ignore resize events as long as an windowResizeHandler execution is in the queue
    if (!throttlerTimeout) {
        throttlerTimeout = setTimeout(() => {
            throttlerTimeout = null;
            callback();
        }, 133.3);
    }
}

class CamerasTab extends React.Component {
    state = {
        mediaIndex: 0,
        loading: false,
        cameras: [],
    };


    slider = React.createRef();

    componentDidMount() {
        this.fetchCameras();
    }

    componentDidUpdate(prevProps, prevState) {
        const { contentID, lineID } = this.props.match.params;
        if (prevProps.match.params.contentID !== contentID && contentID) {
            this.changeFromCarousel(contentID);
        }
        if (prevState.mediaIndex !== this.state.mediaIndex) {
            this.setCurrentContent(this.state.cameras[this.state.mediaIndex].id);
        }
        if (prevProps.match.params.lineID !== lineID) {
            this.fetchCameras();
        }
    }

    fetchCameras = () => {
        const { contentID, lineID } = this.props.match.params;
        let cameras = null;
        if (lineID === LINES_WITH_CAMS[0]) cameras = kingCams;
        if (lineID === LINES_WITH_CAMS[1]) cameras = tosnoCams;
        this.setState({ cameras },
            () => {
                if (contentID) {
                    const mediaIndex = cameras.findIndex((content) => content.id === Number(contentID));
                    this.setNewMediaIdnex(mediaIndex);
                } else {
                    this.setCurrentContent(1);
                }
            });
    };

    componentWillUnmount() {
        window.removeEventListener("resize", this.windowHandler);
    }

    setNewMediaIdnex = (val) => {
        this.setState({ mediaIndex: val });
    };

    setCurrentContent = (media) => {
        const { match: { params: { companySlug, lineID, date } }, history } = this.props;
        const url = `/${companySlug}/content/${lineID}/cameras/${date}/${media}`;
        history.replace(url);
    };

    changeFromCarousel = (contentID) => {
        const mediaIndex = this.state.cameras.findIndex((content) => content.id === Number(contentID));
        this.setState({
            loading: false,
        }, () => this.slider.slickGoTo(mediaIndex));
    };

    renderCameras = (mWidth) => this.state.cameras.map((cam) => (
        <React.Fragment key={cam.id}>
            <div
                style={{
                    maxWidth: `${mWidth}px`,
                    margin: "0 auto",
                    height: mWidth / 16 * 9,
                }}>
                <iframe
                    style={{
                        display: "block",
                        margin: 0,
                        padding: 0,
                        border: 0,
                        width: "100%",
                        maxWidth: "100%",
                    }}
                    src={unescape(cam.src)}
                    title={cam.id}
                    height="100%"
                    frameBorder="0"
                    allowFullScreen />
            </div>
        </React.Fragment>
    ));

    render() {
        const {
            classes, match: { params }, history, screenY, screenX,
        } = this.props;
        const {
            mediaIndex, loading, cameras,
        } = this.state;
        const mWidth = screenY / 0.76;
        return (
            <div className={classes.videoTabWrapper}>
                <div className={classes.videoTabContainer}>
                    <div className={classes.mainCameraContentWrapper}>
                        <div className={classNames(classes.mainContentBox)}>
                            <div className={classes.adaptiveBox}>
                                <Slider
                                    ref={(slider) => { this.slider = slider; }}
                                    {...sliderSettings(classes, this.setNewMediaIdnex)}>
                                    {
                                        this.renderCameras(mWidth)
                                    }
                                </Slider>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Carousel
                            screenX={screenX}
                            screenY={screenY}
                            loading={loading}
                            setNewMediaIdnex={this.setNewMediaIdnex}
                            media={cameras}
                            mediaIndex={mediaIndex}
                            setCurrentContent={this.setCurrentContent}
                            history={history}
                            params={params} />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(CamerasTab));
