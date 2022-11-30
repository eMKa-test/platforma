import React from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import classNames from "classnames";
import Slider from "react-slick";
import LeftSlideArrow from "@material-ui/icons/ArrowBackIos";
import RightSlideArrow from "@material-ui/icons/ArrowForwardIos";
import Loader from "../loader";
import bgItems from "../../assets/icons/stub.png";
import styles from "./styles";

const PrevArrow = (props) => {
    const {
        onClick, classes, media,
    } = props;
    return (
        <button
            type="button"
            onClick={onClick}
            className={classNames(
                classes.selectButtonItem,
                classes.buttonPreviousItem,
                {
                    [classes.buttonChangeItemsShow]: media.length > 6,
                    [classes.buttonChangeItemsHide]: media.length <= 6,
                },
            )}>
            <LeftSlideArrow color="secondary" />
        </button>
    );
};

PrevArrow.propTypes = {
    onClick: PropTypes.func,
    classes: PropTypes.object,
    media: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const NextArrow = (props) => {
    const {
        onClick, classes, media,
    } = props;
    return (
        <button
            type="button"
            onClick={onClick}
            className={classNames(
                classes.selectButtonItem,
                classes.buttonNextItem,
                {
                    [classes.buttonChangeItemsShow]: Array.isArray(media) && media.length > 6,
                    [classes.buttonChangeItemsHide]: Array.isArray(media) && media.length <= 6,
                },
            )}>
            <RightSlideArrow color="secondary" />
        </button>
    );
};

NextArrow.propTypes = {
    onClick: PropTypes.func,
    classes: PropTypes.object,
    media: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

class Carousel extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        screenY: PropTypes.number.isRequired,
        screenX: PropTypes.number.isRequired,
        onAction: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            media: [],
            mediaIndex: null,
            slideSet: 0,
        };
    }

    slider = React.createRef();

    settings = (props) => ({
        dots: false,
        infinite: false,
        speed: 500,
        slidesToScroll: 6,
        slidesToShow: 6,
        nextArrow: <NextArrow {...props} />,
        prevArrow: <PrevArrow {...props} />,
        lazyLoad: true,
    });

    componentDidMount() {
        this.uploadMedia();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.media.length !== this.props.media.length && this.props.media.length > 0) {
            this.uploadMedia();
        }
        if (this.state.mediaIndex !== this.props.mediaIndex) {
            this.syncMediaIndex(this.props.mediaIndex);
        }
        if (prevState.mediaIndex < this.state.mediaIndex) {
            this.nextSlide(this.props.mediaIndex);
        }
        if (prevState.mediaIndex > this.state.mediaIndex) {
            this.prevSlide(this.props.mediaIndex);
        }
    }

    uploadMedia = () => {
        const slidesLimit = this.settings();
        if (!Array.isArray(this.props.media)) {
            return null;
        }
        this.setState({
            media: this.props.media,
            slideSet: Math.ceil(this.props.media.length / slidesLimit.slidesToShow),
            mediaIndex: 0,
        }, this.readyCarousel);
    };

    nextSlide = (index) => {
        const slidesLimit = this.settings();
        const result = index % slidesLimit.slidesToShow;
        if (result === 0) {
            this.slider.slickGoTo(this.props.mediaIndex);
        }
    };

    prevSlide = (index) => {
        const slidesLimit = this.settings();
        const result = index % slidesLimit.slidesToShow;
        if (result === 5) {
            this.slider.slickGoTo(index - 5);
        }
    };

    syncMediaIndex = (val) => {
        this.setState({
            mediaIndex: val,
        });
    };

    readyCarousel = () => {
        this.setState({
            loading: false,
        });
    };

    changeSlide = (id) => {
        const {
            params:
                {
                    type,
                    companySlug,
                    lineID,
                    tab,
                    date,
                },
            history,
        } = this.props;
    };

    renderItems = (media, mediaIndex) => {
        const { classes, setNewMediaIdnex, onAction, currentVideoRef } = this.props;
        return (
            media.map((file, i) => (
                <div
                    key={i}
                    className={classNames(
                        classes.itemContainer,
                        {
                            [classes.selectItem]: mediaIndex === i,
                        },
                    )}>
                    <button
                        type="button"
                        className={classNames(
                            classes.sliderItemTimelapse,
                            {
                                [classes.selectItem]: mediaIndex === i,
                            },
                        )}
                        onClick={() => {
                            if (typeof onAction === "function") {
                                onAction();
                            }
                            if (currentVideoRef && currentVideoRef.current) {
                                currentVideoRef.current.pause();
                            }
                            setNewMediaIdnex(i, file.id);
                        }}>
                        <img
                            className={classNames({
                                [classes.carouselImage]: !file.src.tmb,
                                [classes.carouselImagePic]: file.src.tmb,
                            })}
                            src={file.src.tmb || bgItems}
                            alt="background" />
                        {
                            file.description && (
                                <div className={classes.carouselDescription}>
                                    {file.description}
                                </div>
                            )
                        }
                    </button>
                </div>
            ))
        );
    }

    render() {
        const {
            mediaIndex,
            media,
            slideSet,
        } = this.state;
        const {
            classes, loading, screenY, screenX, onAction,
        } = this.props;
        const result = screenY / 0.465;
        const correctWidth = result > screenX ? screenX : result;
        return (
            <div
                className={classes.sliderWrapperContainer}
                style={{
                    width: `${correctWidth}px`,
                }}>
                {
                    !loading ? (
                        <Slider
                            ref={(slider) => { this.slider = slider; }}
                            {...this.settings(this.props, mediaIndex, slideSet, onAction)}>
                            {this.renderItems(media, mediaIndex)}
                        </Slider>
                    ) : <Loader />
                }
            </div>
        );
    }
}

export default withStyles(styles)(Carousel);
