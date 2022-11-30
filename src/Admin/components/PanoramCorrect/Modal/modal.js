import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from "@material-ui/icons/Close";
import ModalWin from "react-modal";
import Slider from "react-slick";

import classNames from "classnames";
import LeftSlideArrow from "@material-ui/icons/ArrowBackIos";
import RightSlideArrow from "@material-ui/icons/ArrowForwardIos";
import { MAIN_SLIDE_SPEED } from "../../../../constants";
import imageContent from "../../../../Desktop/assets/icons/imageContent.svg";
import videoContent from "../../../../Desktop/assets/icons/videoContent.svg";
import "./style.css";
import VideoPlayer from "../../../../common/VideoPlayer";

const PrevArrow = (props) => {
    const { onClick } = props;
    return (
        <button
            type="button"
            onClick={onClick}
            className={classNames("select__button-item", "button__previous-item")}>
            <LeftSlideArrow />
        </button>
    );
};

const NextArrow = (props) => {
    const { onClick } = props;
    return (
        <button
            type="button"
            onClick={onClick}
            className={classNames("select__button-item", "button__next-item")}>
            <RightSlideArrow />
        </button>
    );
};


class Modal extends React.Component {
    state = {
        mediaIndex: 0,
        loading: false,
        content: [],
        video: null,
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
        this.setState({ content, mediaIndex, video: this.video }, () => {
            this.setContentType(mediaIndex);
        });
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
        this.setState({ mediaIndex: val });
    };

    renderContent = (content, mediaIndex) => (
        content.map((media, i) => {
            if (media.item.type === "IMAGE") {
                return (
                    <div key={media.item.id}>
                        <img
                            src={media.item.src.src}
                            style={{ width: "100%" }}
                            alt="Platforma" />
                    </div>
                );
            }
            return (
                <div key={media.item.id}>
                    <VideoPlayer
                        ref={mediaIndex === i ? this.video : null}
                        className="mb-0"
                        src={media.item.src.src}
                        preload="metadata" />
                </div>
            );
        })
    );

    changeSlide = (index) => {
        this.slider.slickGoTo(index);
    };

    render() {
        const {
            isOpen, fullScreenContent, content,
        } = this.props;
        const { loading, mediaIndex, contentType } = this.state;
        return (
            <ModalWin
                className="Modal"
                overlayClassName="Overlay"
                isOpen={isOpen}
                onRequestClose={fullScreenContent}>
                <div className="Modal-content">
                    <div className="Modal-content_adaptive-wrapper">
                        <div className="modal__wrapper-adaptive">
                            <div className="modal__main-container">
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
                                        <div className="progress__items-wrapper">
                                            <CircularProgress className="item__loader" />
                                        </div>
                                    )
                                }
                                <button
                                    className="moadl-panoram_close-btn"
                                    type="button"
                                    onClick={fullScreenContent}>
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className="modal__item-container">
                                {
                                    content.map((el, i) => (
                                        <div
                                            key={el.item.id}
                                            className={classNames("wrapper__panoram-items",
                                                {
                                                    active__item: mediaIndex === i,
                                                })}>
                                            <button
                                                type="button"
                                                onClick={() => this.changeSlide(i)}
                                                className={classNames("item__wrapper-btn",
                                                    {
                                                        active__frame: mediaIndex === i,
                                                    })}>
                                                <img
                                                    style={{ width: "100%" }}
                                                    src={el.item.src.tmb}
                                                    alt="thumb-item" />
                                                <img
                                                    src={el.item.type === "IMAGE" ? imageContent : videoContent}
                                                    className="show__content-type"
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

export default Modal;
