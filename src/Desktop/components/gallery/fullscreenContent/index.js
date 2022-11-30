import React, { Component } from "react";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
import get from "lodash/get";
import { withStyles } from "@material-ui/core/styles";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import classNames from "classnames";
import LeftSlideArrow from "@material-ui/icons/ArrowBackIos";
import RightSlideArrow from "@material-ui/icons/ArrowForwardIos";
import * as PropTypes from "prop-types";
import Slider from "react-slick";
import { GridListTile, GridListTileBar } from "@material-ui/core";
import galleryJSS from "../styles";
import OptionsMenu from "../optionsMenu";
import VideoPlayer from "../../../../common/VideoPlayer";
import { addExtraParams, sendMetrics } from "./helpers";
import {
    CONTENT, MATERIAL, SHARE, STREAM, MAIN, SLIDE_SHOW, MODEL_3D,
} from "../../../../constants";
import metrikaEvents, {
    VIDEO_CHANGE, VIDEO_EXIT, VIDEO_PAUSE, VIDEO_RESUME,
    VIDEO_START, VIEWED, FULLSCREEN_SCORE, SLIDE_SHOW_VIEW,
} from "../../../../common/Metrika";
import PlaceHolder from "../../../../common/PlaceHolder";
import ContentLoader from "../../../../common/ContentLoader";

const Arrow = (props) => {
    const {
        onClick = () => {}, classes, direction = null, extraStyle, showArrows = true,
    } = props;
    let arrowImage;
    let arrowStyle;

    if (!direction) {
        return null;
    }

    switch (direction) {
        case "prev":
            arrowStyle = classes.fullscreenButtonPreviousItem;
            arrowImage = <LeftSlideArrow color="secondary" />;
            break;
        case "next":
            arrowStyle = classes.fullscreenButtonNextItem;
            arrowImage = <RightSlideArrow color="secondary" />;
            break;
        default:
            arrowStyle = null;
            arrowImage = null;
            break;
    }

    return (
        <CSSTransition
            in={showArrows}
            timeout={500}
            mountOnEnter
            unmountOnExit
            classNames={{
                enter: classes.fastFadeEnter,
                enterActive: classes.fastFadeEnterActive,
                exit: classes.fastFadeExit,
                exitActive: classes.fastFadeExitActive,
            }}>
            <button
                type="button"
                className={classNames(classes.fullscreenSelectButtonItem, arrowStyle, extraStyle)}
                onClick={onClick}>
                {arrowImage}
            </button>
        </CSSTransition>
    );
};

Arrow.propTypes = {
    onClick: PropTypes.func,
    classes: PropTypes.object,
    extraStyle: PropTypes.string,
    direction: PropTypes.string.isRequired,
    showArrows: PropTypes.bool,
};

let viewedContent = new Set();

class FullscreenContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idx: null,
            opened: false,
            paused: true,
            currentTime: 0,
            duration: 0,
            volume: 1,
            showPlayOverlay: true,
            isDragged: false,
            reverseDirection: false,
            loading: true,
            animationType: MAIN,
            showArrows: true,
            slideShowOn: false,
            firstSlide: 0,
        };
    }

    static settings = {
        dots: false,
        infinite: true,
        speed: 300,
        slidesToScroll: 1,
        slidesToShow: 6,
        lazyLoad: true,
        swipeToSlide: true,
    };

    slider = React.createRef();

    currentVideo = React.createRef();

    video = React.createRef();

    componentDidMount() {
        if (isEmpty(this.props.content)) {
            return null;
        }
        this.setState({ idx: this.props.idx || 0 }, () => {
            if (typeof this.slider.slickGoTo === "function") {
                this.slider.slickGoTo(this.state.idx);
            }
            viewedContent = new Set();
            viewedContent.add(this.props.idx);
        });
        return null;
    }

    componentDidUpdate() {
        if (this.video.current && (this.video.current !== this.currentVideo.current)) {
            this.currentVideo.current = this.video.current;
        }
    }

    componentWillUnmount() {
        clearTimeout(this.slideShowTimeout);
        const { idx, slideShowOn } = this.state;
        const { content, contentType } = this.props;
        if (slideShowOn) {
            const { firstSlide } = this.state;
            const currentSlide = this.state.idx + 1;
            const lastSlide = this.props.content.length;
            const viewedCountSlides = currentSlide - firstSlide + 1;
            metrikaEvents.emit(
                SLIDE_SHOW_VIEW,
                {
                    firstSlide, lastSlide: currentSlide, viewedCountSlides, totalSlides: lastSlide,
                },
            );
        }
        if (this.currentVideo.current) {
            const { currentTime, duration } = this.currentVideo.current;
            sendMetrics(VIDEO_EXIT, content[idx].src.src, contentType, content[idx].type, duration, currentTime);
        }
        metrikaEvents.emit(
            FULLSCREEN_SCORE,
            { mediaType: content[idx].type, contentType, viewedUniqueContent: viewedContent.size },
        );
    }

    beforeDrag = () => {
        this.setState(() => ({ isDragged: true }), () => {
            setTimeout(() => { this.setState({ isDragged: false }); }, 0);
        });
    };

    handleImageSelect = (index) => {
        if (this.state.idx === index || this.state.isDragged) {
            return;
        }
        if (this.state.slideShowOn) {
            clearTimeout(this.slideShowTimeout);
        }
        this.setState({ reverseDirection: index < this.state.idx }, () => {
            const { content, contentType } = this.props;
            this.setState((prevState) => {
                if (content[prevState.idx].type === "VIDEO") {
                    sendMetrics(
                        VIDEO_CHANGE,
                        content[prevState.idx].src.src,
                        contentType,
                        content[prevState.idx].type,
                        prevState.duration,
                        prevState.currentTime,
                    );
                }
                viewedContent.add(index);
                return { idx: index, showPlayOverlay: (prevState.idx !== index), loading: true };
            });
        });
    };

    handleOpen = () => {
        this.setState((prevState) => ({ opened: !prevState.opened }));
    };

    /**
     * Кол-во пролистываемых элементов
     * @param difference
     */
    handleImageChange = (difference) => {
        if (typeof difference !== "number") {
            return;
        }

        this.setState({ reverseDirection: difference < 0 }, () => {
            const { idx } = this.state;
            const content = get(this.props, "content", []);

            if (isEmpty(content)) {
                return;
            }

            // останавливает переключение на предыдущий слайд перед первым слайдом
            if (idx === 0 && difference < 0) {
                return;
            }

            // останавливает переключение на следующий слайд после последнего слайда
            if (idx === (content.length - 1) && difference > 0) {
                return;
            }

            const newIdx = Number(idx) + Number(difference);

            this.setState({ idx: newIdx, showPlayOverlay: true, loading: true }, () => {
                this.slider.slickGoTo(newIdx, false);
                viewedContent.add(newIdx);
                if (content[idx].type === "VIDEO") {
                    sendMetrics(
                        VIDEO_CHANGE,
                        content[idx].src.src,
                        this.props.contentType,
                        content[idx].type,
                        this.state.duration,
                        this.state.currentTime,
                    );
                }
            });
        });
    };

    handlePlay = () => {
        this.currentVideo.current.play();
        this.setState({ showPlayOverlay: false });
    };

    handlePause = () => {
        this.currentVideo.current.pause();
    };

    handleSlideShow = (playing) => {
        if (playing) {
            const currentSlide = this.state.idx + 1;
            const lastSlide = this.props.content.length;
            if (currentSlide === lastSlide) {
                return;
            }
            this.setState((state) => ({
                slideShowOn: true,
                paused: false,
                animationType: SLIDE_SHOW,
                showArrows: false,
                firstSlide: state.idx + 1,
            }), () => {
                this.handleImageChange(1);
            });
        } else {
            this.setState({
                slideShowOn: false, paused: true, animationType: MAIN, showArrows: true,
            }, () => {
                clearTimeout(this.slideShowTimeout);
                const { firstSlide } = this.state;
                const currentSlide = this.state.idx + 1;
                const lastSlide = this.props.content.length;
                const viewedCountSlides = currentSlide - firstSlide + 1;
                metrikaEvents.emit(
                    SLIDE_SHOW_VIEW,
                    {
                        firstSlide, lastSlide: currentSlide, viewedCountSlides, totalSlides: lastSlide,
                    },
                );
            });
        }
    };

    handleTransitionAnimation = (type) => {
        const { classes } = this.props;
        switch (type) {
            case MAIN:
                return {
                    enter: (this.state.reverseDirection)
                        ? classes.slideEnterReverse
                        : classes.slideEnter,
                    enterActive: classes.slideEnterActive,
                    exit: classes.slideExit,
                    exitActive: (this.state.reverseDirection)
                        ? classes.slideExitActiveReverse
                        : classes.slideExitActive,
                };
            case SLIDE_SHOW:
                return {
                    enter: classes.fadeEnter,
                    enterActive: classes.fadeEnterActive,
                    exit: classes.fadeExit,
                    exitActive: classes.fadeExitActive,
                };
            default:
                return null;
        }
    };

    onPause = (src, contentType, mediaType) => {
        const { currentTime, duration } = this.currentVideo.current;
        if (currentTime !== duration) {
            sendMetrics(VIDEO_PAUSE, src, contentType, mediaType, duration, currentTime);
        }
        this.setState({ paused: true });
    };

    onPlaying = (src, contentType, mediaType) => {
        this.setState({ paused: false }, () => {
            const { currentTime, duration } = this.currentVideo.current;
            if (currentTime > 0.1) {
                sendMetrics(VIDEO_RESUME, src, contentType, mediaType, duration, currentTime);
                return;
            }
            sendMetrics(VIDEO_START, src, contentType, mediaType, duration);
        });
    };

    onLoad = (src, contentType, mediaType) => {
        this.setState({ loading: false }, () => {
            sendMetrics(VIEWED, src, contentType, mediaType);
            if (this.state.slideShowOn) {
                const currentSlide = this.state.idx + 1;
                const lastSlide = this.props.content.length;
                if (currentSlide === lastSlide) {
                    this.setState({
                        slideShowOn: false, paused: true, animationType: MAIN, showArrows: true,
                    }, () => {
                        const { firstSlide } = this.state;
                        const viewedCountSlides = currentSlide - firstSlide + 1;
                        metrikaEvents.emit(
                            SLIDE_SHOW_VIEW,
                            {
                                firstSlide, lastSlide: currentSlide, viewedCountSlides, totalSlides: lastSlide,
                            },
                        );
                    });
                    return;
                }
                this.slideShowTimeout = setTimeout(() => {
                    this.handleImageChange(1);
                }, 4000);
            }
        });
    };

    onEnded = (src, contentType, mediaType) => {
        if (contentType === CONTENT || contentType === MODEL_3D) {
            this.handleImageChange(1);
        }
        if (contentType === STREAM) {
            this.currentVideo.current.play();
        }
        sendMetrics(VIEWED, src, contentType, mediaType, this.currentVideo.current.duration);
    };

    refTimeChange = debounce((val) => {
        this.currentVideo.current.currentTime = val;
    }, 16.6);

    onTimeChange = (val) => {
        this.setState({ currentTime: val }, () => this.refTimeChange(val));
    };

    refVolumeChange = debounce((val) => {
        this.currentVideo.current.volume = val;
    }, 16.6);

    onVolumeChange = (val) => {
        this.setState({ volume: val }, () => this.refVolumeChange(val));
    };

    updateProgressBar = (event) => {
        const { target: { currentTime } } = event;
        if (currentTime > 0) {
            this.setState({ currentTime });
        }
    };

    resetMetadata = (event) => {
        const { target: { duration } } = event;
        this.setState({ paused: true, currentTime: 0, duration });
    };

    renderImageList = (content) => {
        const { classes } = this.props;
        return (
            content.map((img, i) => (
                <GridListTile
                    key={String(i)}
                    className={classes.fullscreenSliderImageContainer}
                    onClick={() => this.handleImageSelect(i)}>
                    { img.src.tmb
                        ? (
                            <div className={classes.fullscreenSliderImage}>
                                <img
                                    src={img.src.tmb}
                                    alt="content" />
                            </div>
                        )
                        : <PlaceHolder type={img.type} /> }
                    {
                        img.description ? (
                            <GridListTileBar
                                title={img.description}
                                classes={{ title: classes.description }} />
                        ) : null
                    }
                </GridListTile>
            ))
        );
    };

    renderLoader = (loading) => {
        const { classes } = this.props;
        return (
            <CSSTransition
                in={loading}
                timeout={300}
                mountOnEnter
                unmountOnExit
                classNames={{
                    enter: classes.fastFadeEnter,
                    enterActive: classes.fastFadeEnterActive,
                    exit: classes.fastFadeExit,
                    exitActive: classes.fastFadeExitActive,
                }}>
                <div data-test="loader-wrapper">
                    <ContentLoader />
                </div>
            </CSSTransition>
        );
    };

    renderFullscreenContentItem = (content) => {
        const { paused, showPlayOverlay, loading } = this.state;
        const { classes, contentType } = this.props;
        switch (content.type) {
            case "IMAGE":
                return (
                    <div className={classes.fullscreenContentItemWrapper}>
                        <img
                            className={classes.fullscreenContentItem}
                            src={content.src.src}
                            onLoad={() => { this.onLoad(content.src.src, contentType, content.type); }}
                            alt="" />
                        {this.renderLoader(loading)}
                    </div>
                );
            case "VIDEO":
                return (
                    <div className={classes.fullscreenContentItemWrapper}>
                        <VideoPlayer
                            className={classes.fullscreenContentItem}
                            ref={this.video}
                            src={content.src.src}
                            onPause={() => { this.onPause(content.src.src, contentType, content.type); }}
                            onPlaying={(event) => {
                                this.onPlaying(content.src.src, contentType, content.type, event.currentTarget);
                            }}
                            onTimeUpdate={this.updateProgressBar}
                            onLoadedMetadata={this.resetMetadata}
                            onEnded={() => { this.onEnded(content.src.src, contentType, content.type); }}
                            onClick={(paused) ? this.handlePlay : this.handlePause}
                            onCanPlay={() => { this.setState({ loading: false }); }}
                            preload="metadata"
                            controls={false}
                            {...addExtraParams(contentType)} />
                        {this.renderLoader((contentType !== SHARE) && loading)}
                        { contentType === MATERIAL ? (
                            <span
                                onClick={this.handlePlay}
                                className={classNames(
                                    "icon-fontello-1-play",
                                    classes.fullscreenVideoOverlay,
                                    (showPlayOverlay) ? classes.fullscreenVideoOverlayPause : null,
                                )} />
                        ) : null }
                    </div>
                );
            default:
                return null;
        }
    };

    render() {
        const { idx } = this.state;
        if (Object.is(idx, null)) {
            return null;
        }

        const {
            opened, currentTime, duration, paused, volume, animationType, showArrows,
        } = this.state;

        const {
            content, classes, noHoverZone,
        } = this.props;

        return (
            <div className={classes.fullscreenContent}>
                {
                    (content) ? (
                        <div className={classes.fullscreenContentWrapper}>
                            <Arrow
                                onClick={debounce(() => {
                                    this.handleImageChange(-1);
                                }, 300)}
                                classes={classes}
                                extraStyle={classes.fullscreenContentItemArrow}
                                direction="prev"
                                showArrows={(idx === 0) ? false : showArrows} />
                            <TransitionGroup
                                component="div"
                                className={classes.fullscreenMainSliderWrapper}>
                                <CSSTransition
                                    key={content[idx].id}
                                    timeout={(animationType === MAIN) ? 300 : 1000}
                                    classNames={this.handleTransitionAnimation(animationType)}>
                                    {this.renderFullscreenContentItem(content[idx])}
                                </CSSTransition>
                            </TransitionGroup>
                            <Arrow
                                onClick={debounce(() => {
                                    this.handleImageChange(1);
                                }, 300)}
                                classes={classes}
                                extraStyle={classes.fullscreenContentItemArrow}
                                direction="next"
                                showArrows={(idx === content.length - 1) ? false : showArrows} />
                        </div>
                    ) : null
                }
                <OptionsMenu
                    handleOpen={this.handleOpen}
                    opened={opened}
                    type={["slideShow", "videoControls", "download", "share"]}
                    src={content[idx].src.src}
                    mediaType={content[idx].type}
                    currentTime={currentTime}
                    duration={duration}
                    paused={paused}
                    handlePlay={this.handlePlay}
                    handlePause={this.handlePause}
                    onTimeChange={this.onTimeChange}
                    onVolumeChange={this.onVolumeChange}
                    handleSlideShow={this.handleSlideShow}
                    currentSlide={idx + 1}
                    lastSlide={content.length}
                    volume={volume} />
                <div className={classes.fullscreenLeftHoverZoneCancel} />
                <div className={classes.fullscreenRightHoverZoneCancel} />
                {
                    (!noHoverZone) ? (
                        <div
                            className={classNames(
                                classes.fullscreenSliderHoverZone,
                                (opened) ? classes.hide : classes.reveal,
                            )}>
                            <div className={classes.fullscreenBottomPanel} />
                            <Slider
                                className={classes.innerSlider}
                                ref={(slider) => { this.slider = slider; }}
                                prevArrow={(
                                    <Arrow
                                        onClick={() => {}}
                                        classes={classes}
                                        direction="prev" />
                                )}
                                nextArrow={(
                                    <Arrow
                                        onClick={() => {}}
                                        classes={classes}
                                        direction="next" />
                                )}
                                {...FullscreenContent.settings}
                                beforeChange={this.beforeDrag}>
                                {this.renderImageList(content)}
                            </Slider>
                        </div>
                    ) : null
                }
            </div>
        );
    }
}

FullscreenContent.propTypes = {
    classes: PropTypes.object,
    idx: PropTypes.number,
    content: PropTypes.array,
    screenWidth: PropTypes.number,
    screenHeight: PropTypes.number,
    contentType: PropTypes.string,
    noHoverZone: PropTypes.bool,
};

export default withStyles(galleryJSS)(FullscreenContent);
