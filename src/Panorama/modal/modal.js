import React from "react";
import * as Proptypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from "@material-ui/icons/Close";
import ModalWin from "react-modal";
import Slider from "react-slick/lib";
import classNames from "classnames";
import LeftSlideArrow from "@material-ui/icons/ArrowBackIos";
import RightSlideArrow from "@material-ui/icons/ArrowForwardIos";
import styles from "./styles";
import "./style.css";
import { MAIN_SLIDE_SPEED } from "../../constants";
import imageContent from "../../Desktop/assets/icons/imageIcon2.svg";
import videoContent from "../../Desktop/assets/icons/videoIcon2.svg";
import VideoPlayer from "../../common/VideoPlayer";
import Loader from "../../Desktop/components/loader/Loader";
import metrikaEvents, { PANORAMA_VIEW_CONTENT } from "../../common/Metrika";

const customStyles = {
    content: {
        zIndex: 1,
        width: "60%",
        height: "100%",
    },
};

const PrevArrow = (props) => {
    const { onClick, classes } = props;
    return (
        <button
            type="button"
            onClick={onClick}
            className={classNames(classes.selectButtonItem, classes.buttonPreviousItem)}>
            <LeftSlideArrow color="secondary" />
        </button>
    );
};

PrevArrow.propTypes = {
    onClick: Proptypes.func,
    classes: Proptypes.object.isRequired,
};

const NextArrow = (props) => {
    const { onClick, classes } = props;
    return (
        <button
            type="button"
            onClick={onClick}
            className={classNames(classes.selectButtonItem, classes.buttonNextItem)}>
            <RightSlideArrow color="secondary" />
        </button>
    );
};

NextArrow.propTypes = {
    onClick: Proptypes.func,
    classes: Proptypes.object.isRequired,
};

class Modal extends React.Component {
    state = {
        mediaIndex: 0,
        loading: false,
        content: [],
        video: null,
        loadingContent: [],
        contentType: "",
    }

    slider = React.createRef();

    video = React.createRef();

    settings = (type) => ({
        dots: false,
        infinite: false,
        adaptiveHeight: false,
        contentType: false,
        speed: MAIN_SLIDE_SPEED,
        slidesToScroll: 1,
        slidesToShow: 1,
        beforeChange: (i, next) => {
            if (type) {
                this.state.video.current.pause();
            }
            this.setNewMediaIdnex(next);
        },
        nextArrow: <NextArrow
            {...this.props}
            {...this.state} />,
        prevArrow: <PrevArrow
            {...this.props}
            {...this.state} />,
    });

    componentDidMount() {
        const { content, index } = this.props;
        const mediaIndex = content.findIndex(({ item }) => item.id === index);
        const contentType = content[mediaIndex].item.type !== "IMAGE";
        this.setState({ contentType, content, mediaIndex, video: this.video });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.video.current && !this.state.video) {
            const elem = this.video;
            this.setVideoRef(elem);
        }
        if (prevState.mediaIndex !== this.state.mediaIndex) {
            this.changeSlide(this.state.mediaIndex);
            this.setContentType(this.state.mediaIndex);
        }
    }

    setVideoRef = (val) => {
        this.setState({
            video: val,
        });
    };

    setContentType = (val) => {
        const { content } = this.state;
        const contentType = content[val].item.type !== "IMAGE";
        this.setState({ contentType });
    };

    setNewMediaIdnex = (val) => {
        const { companySlug, lineID } = this.props.tabInfo;
        this.setState({ mediaIndex: val }, () => {
            const { item } = this.state.content[val];
            const meta = {
                company: companySlug,
                lineID,
                contentID: item.id,
                mediaType: item.type,
                source: item.src.src,
                description: item.description,
                gps: item.gps,
            };
            metrikaEvents.emit(PANORAMA_VIEW_CONTENT, meta);
        });
    };

    checkLoad = (id) => {
        this.setState((state) => ({
            loadingContent: state.loadingContent.concat(id),
        }));
    };

    renderContent = (content, mediaIndex) => (
        content.map((media, i) => {
            const notLoaded = this.state.loadingContent.includes(media.item.id);
            switch (media.item.type) {
                case "IMAGE":
                    return (
                        <div
                            key={media.item.id}
                            className="panorama-content_modal-wrapper">
                            {
                                !notLoaded && (
                                    <div className="loader-wrapper-panorama-content_modal">
                                        <Loader />
                                    </div>
                                )
                            }
                            <img
                                className={classNames(
                                    {
                                        "panorama-content_modal_loaded": notLoaded,
                                        "panorama-content_modal_loading": !notLoaded,
                                    },
                                )}
                                onLoad={() => this.checkLoad(media.item.id)}
                                src={media.item.src.src}
                                alt="Platforma" />
                        </div>
                    );
                case "VIDEO":
                    return (
                        <div
                            key={media.item.id}
                            className="panorama-content_modal-wrapper">
                            {
                                !notLoaded && (
                                    <div className="loader-wrapper-panorama-content_modal">
                                        <Loader />
                                    </div>
                                )
                            }
                            <VideoPlayer
                                className={classNames(
                                    "mb-0",
                                    {
                                        "panorama-content_modal_loaded": notLoaded,
                                        "panorama-content_modal_loading": !notLoaded,
                                    },
                                )}
                                ref={mediaIndex === i ? this.video : null}
                                onCanPlay={() => this.checkLoad(media.item.id)}
                                src={media.item.src.src}
                                preload="metadata" />
                        </div>
                    );
                default: {
                    return null;
                }
            }
        })
    );

    changeSlide = (index) => {
        this.slider.slickGoTo(index);
    };

    render() {
        const {
            classes, isOpen, fullScreenContent, content,
        } = this.props;
        const { loading, mediaIndex, contentType } = this.state;
        return (
            <ModalWin
                style={customStyles}
                className="Modal"
                overlayClassName="Overlay"
                isOpen={isOpen}
                onRequestClose={fullScreenContent}>
                <div className="Modal-content">
                    <div
                        className="Modal-content_adaptive-wrapper">
                        <div className={classes.modalWrapperAdaptive}>
                            <div className={classes.modalMainContainer}>
                                {
                                    !loading ? (
                                        <Slider
                                            ref={(slider) => { this.slider = slider; }}
                                            {...this.settings(contentType)}>
                                            {
                                                this.renderContent(content, mediaIndex)
                                            }
                                        </Slider>

                                    ) : (
                                        <div className={classes.progressItemsWrapper}>
                                            <CircularProgress className={classes.itemLoader} />
                                        </div>
                                    )
                                }
                                <button
                                    className="moadl-panoram_close-btn"
                                    type="button"
                                    onClick={fullScreenContent}>
                                    <CloseIcon color="secondary" />
                                </button>
                            </div>
                            <div className={classes.modalItemContainer}>
                                {
                                    content.map((el, i) => (
                                        <div
                                            key={el.item.id}
                                            className={classNames(
                                                classes.wrapperPanoramItems,
                                                {
                                                    [classes.activeItem]: mediaIndex === i,
                                                },
                                            )}>
                                            <button
                                                type="button"
                                                onClick={() => this.changeSlide(i)}
                                                className={classNames(
                                                    classes.itemWrapperBtn,
                                                    {
                                                        [classes.activeFrame]: mediaIndex === i,
                                                    },
                                                )}>
                                                <img
                                                    style={{ width: "100%" }}
                                                    src={el.item.src.tmb}
                                                    alt="thumb-item" />
                                                <img
                                                    src={el.item.type === "IMAGE" ? imageContent : videoContent}
                                                    className={classes.showContentType}
                                                    alt="content_type" />
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </ModalWin>
        );
    }
}

Modal.propTypes = {
    content: Proptypes.array,
    index: Proptypes.number,
};

export default withStyles(styles)(Modal);
