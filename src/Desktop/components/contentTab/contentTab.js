import React from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import Slider from "react-slick/lib";
import classNames from "classnames";
import Loader from "../loader";
import NoContent from "../noContent";
import Carousel from "../carousel/carousel";
import { sliderSettings } from "../mainSliderSettings/sliderSettings";
import styles from "./styles";
import VideoPlayer from "../../../common/VideoPlayer";
import metrikaEvents, {
    VIDEO_CHANGE, VIDEO_EXIT, VIDEO_PAUSE, VIDEO_RESUME,
    VIDEO_START, VIEWED,
} from "../../../common/Metrika";
import { CONTENT, VIDEO } from "../../../constants";
import { getContentController } from "../../router/routeControl";
import { ALL_MENU_ITEMS_ROUTES_V2 } from "../../router/routePaths";

class ContentTab extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        screenX: PropTypes.number.isRequired,
        screenY: PropTypes.number.isRequired,
        media: PropTypes.array,
        contentType: PropTypes.string,
        location: PropTypes.object.isRequired,
        setContentId: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            mediaIndex: null,
            loading: false,
            videos: [],
            images: [],
            contentLoadFalse: false,
            video: null,
            contentType: null,
            slider: null,
        };
    }

    slider = React.createRef();

    video = React.createRef();

    componentDidMount() {
        const { location } = this.props;
        const { params } = getContentController(location.pathname, ALL_MENU_ITEMS_ROUTES_V2);
        this.fetchMedia(params.contentID);
    }

    componentDidUpdate(prevProps, prevState) {
        const { location: prevLocation } = prevProps;
        const { params: prevParams } = getContentController(prevLocation.pathname, ALL_MENU_ITEMS_ROUTES_V2);
        const { location } = this.props;
        const { params } = getContentController(location.pathname, ALL_MENU_ITEMS_ROUTES_V2);
        if (this.slider && !this.slider.current && this.slider !== this.state.slider) {
            this.setSliderRef(this.slider);
        }
        if (prevParams.contentID !== params.contentID && params.contentID) {
            this.reloadUrl(params.contentID);
        }
        if (this.state.contentType && this.state.contentType !== "images") {
            if (this.video.current && !this.state.video) {
                const elem = this.video;
                this.setVideoRef(elem);
            }
        }
        if (prevState.mediaIndex !== this.state.mediaIndex && this.state.contentType) {
            this.checkRouteContentID(this.state.mediaIndex, params);
        }
    }

    reloadUrl = (cid) => {
        const { contentType } = this.state;
        const newIndex = this.state[contentType].findIndex((elem) => elem.id === Number(cid));
        if (newIndex >= 0) {
            this.setState({ mediaIndex: newIndex });
        }
    }

    checkRouteContentID = (index, params) => {
        const id = this.state[this.state.contentType][index].id;
        if (params.contentID && params.contentID !== id) {
            const url = `/${params.companySlug}/content/${params.lineID}/${params.tab}/${params.date}/${id}`;
            this.props.setContentId(url);
        }
        this.slider.slickGoTo(this.state.mediaIndex);
    }

    componentWillUnmount() {
        if (this.video && this.video.current) {
            const { videos, mediaIndex } = this.state;
            const { currentTime, duration } = this.video.current;
            const args = {
                source: videos[mediaIndex].src.src,
                mediaType: VIDEO,
                contentType: CONTENT,
                tab: videos[mediaIndex].type,
                duration: Math.floor(duration),
                currentTime: Math.floor(currentTime),
            };
            this.onEvent("onExit", args)();
        }
    }

    setVideoRef = (val) => {
        this.setState({
            video: val,
        });
    };

    setSliderRef = (val) => {
        this.setState({
            slider: val,
        }, () => {
            this.slider.slickGoTo(this.state.mediaIndex);
        });
    };

    fetchMedia = (cid) => {
        const { routeParams, media } = this.props;
        let mediaIndex = 0;
        if (cid) {
            const checkIndex = media.findIndex((el) => el.id === Number(cid));
            if (checkIndex >= 0) {
                mediaIndex = checkIndex;
            }
        }
        this.setState({
            loading: true,
            contentLoadFalse: false,
            mediaIndex,
            videos: [],
            images: [],
            contentType: null,
        }, () => {
            const contentType = (routeParams.tab === "image") ? "images" : "videos";
            this.setState({
                [contentType]: media,
                contentType,
                contentLoadFalse: false,
                loading: false,
            });
        });
    };

    setNewMediaIdnex = (val) => {
        this.setState({ mediaIndex: val });
    };

    onEvent = (eventName, args) => () => {
        if (!this.video.current) {
            return;
        }
        const currentTime = Math.floor(this.video.current.currentTime);
        const duration = Math.floor(this.video.current.duration);
        switch (eventName) {
            case "onTimeUpdate": {
                this.setState({
                    playing: `${args.source}::${args.tab}::${Math.floor(this.video.current.currentTime)}::${Math.floor(this.video.current.duration)}`,
                });
                break;
            }
            case "onPlaying": {
                if (this.video.current.currentTime > 0.1) {
                    metrikaEvents.emit(VIDEO_RESUME, {
                        ...args,
                        duration,
                        currentTime,
                    });
                    return;
                }
                metrikaEvents.emit(VIDEO_START, {
                    ...args,
                    duration,
                });
                break;
            }
            case "onChange": {
                const { playing } = this.state;
                if (playing) {
                    this.setState({ playing: null }, () => {
                        const [source, tab, stopTime, dur] = playing.split("::");
                        metrikaEvents.emit(VIDEO_CHANGE, {
                            source,
                            mediaType: VIDEO,
                            contentType: CONTENT,
                            tab,
                            duration: Number(dur),
                            stopTime: Number(stopTime),
                        });
                    });
                }
                break;
            }
            case "onPause": {
                if (currentTime !== duration) {
                    metrikaEvents.emit(VIDEO_PAUSE, {
                        ...args,
                        duration,
                        stopTime: currentTime,
                    });
                }
                break;
            }
            case "onEnded": {
                metrikaEvents.emit(VIEWED, {
                    ...args,
                    duration: Math.floor(this.video.current.duration),
                });
                break;
            }
            case "onExit": {
                metrikaEvents.emit(VIDEO_EXIT, args);
                break;
            }
            default: {
                // ...
            }
        }
    };

    renderSlider = (videos, images, mediaIndex, mWidth, tab) => {
        if (tab === "image") {
            return (
                <Slider
                    ref={(slider) => {
                        this.slider = slider;
                    }}
                    {...sliderSettings(this.props.classes, this.setNewMediaIdnex)}>
                    {this.state.images.map((file, i) => (
                        <React.Fragment key={file.id}>
                            <img
                                style={{
                                    maxWidth: `${mWidth}px`,
                                }}
                                src={file.src.src}
                                alt="content" />
                        </React.Fragment>
                    ))}
                </Slider>
            );
        }
        return (
            <Slider
                ref={(slider) => {
                    this.slider = slider;
                }}
                {...sliderSettings(
                    this.props.classes,
                    this.setNewMediaIdnex,
                    this.video,
                    this.onEvent("onChange", {}),
                )}>
                {Array.isArray(videos) && videos.map((file, i) => {
                    const args = {
                        source: file.src.src,
                        mediaType: VIDEO,
                        contentType: CONTENT,
                        tab: file.type,
                    };
                    return (
                        <React.Fragment key={file.id}>
                            <VideoPlayer
                                ref={mediaIndex === i ? this.video : null}
                                onTimeUpdate={this.onEvent("onTimeUpdate", args)}
                                onPlaying={this.onEvent("onPlaying", args)}
                                onPause={this.onEvent("onPause", args)}
                                onEnded={this.onEvent("onEnded", args)}
                                maxWidth={`${mWidth}px`}
                                src={file.src.src}
                                preload={mediaIndex === i ? "metadata" : "none"} />
                        </React.Fragment>
                    );
                })}
            </Slider>
        );
    };

    render() {
        const {
            classes, routeParams, history, screenY, screenX,
        } = this.props;
        const {
            videos, mediaIndex, loading, images, contentType, contentLoadFalse,
        } = this.state;
        const mWidth = screenY / 0.75;
        return (
            <div className={classes.videoTabWrapper}>
                <div className={classes.videoTabContainer}>
                    <div className={classes.mainContentWrapper}>
                        <div className={classNames(classes.mainContentBox)}>
                            {contentLoadFalse && <NoContent />}
                            <div className={classes.adaptiveBox}>
                                {
                                    !loading
                                        ? this.renderSlider(videos, images, mediaIndex, mWidth, routeParams.tab)
                                        : <Loader />
                                }
                            </div>
                        </div>
                    </div>
                    <div className={classes.itemsContentWrapper}>
                        {contentType && (
                            <Carousel
                                screenX={screenX}
                                screenY={screenY}
                                loading={loading}
                                setNewMediaIdnex={this.setNewMediaIdnex}
                                media={this.state[contentType]}
                                mediaIndex={mediaIndex}
                                history={history}
                                params={routeParams}
                                currentVideoRef={this.video}
                                onAction={this.onEvent("onChange", {})} />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(ContentTab));
