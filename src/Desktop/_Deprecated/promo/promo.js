import React from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import Slider from "react-slick/lib";
import Loader from "../loader";
import axios from "../../common/axios";
import styles from "./styles";
import Carousel from "../carousel/carousel";
import { sliderSettings } from "../mainSliderSettings/sliderSettings";
import { PROMO } from "../../../constants";
import VideoPlayer from "../../../common/VideoPlayer";

class Promo extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        currentCompany: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        classes: PropTypes.object.isRequired,
        screenY: PropTypes.number.isRequired,
        screenX: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            mediaIndex: 0,
            loading: false,
            videos: [],
            video: null,
        };
    }

    slider = React.createRef();

    video = React.createRef();

    componentDidMount() {
        this.fetchMedia();
    }

    componentDidUpdate(prevProps, prevState) {
        const { type, contentID } = this.props.params;
        if (this.video.current && !this.state.video) {
            const elem = this.video;
            this.setVideoRef(elem);
        }
        if (prevProps.params.type !== type) {
            this.fetchMedia();
        }
        if (prevProps.params.contentID !== contentID && prevProps.params.contentID && contentID) {
            this.getContentId(contentID);
        }
        if (prevState.mediaIndex !== this.state.mediaIndex && this.state.videos.length > 0) {
            this.setCurrentContent(this.state.videos[this.state.mediaIndex].id);
        }
    }

    getContentId = (contentID) => {
        if (this.video.current) {
            this.video.current.pause();
        }
        const mediaIndex = this.state.videos.findIndex((content) => content.id === Number(contentID));
        if (mediaIndex >= 0) {
            this.setState({ mediaIndex }, () => this.slider.slickGoTo(mediaIndex));
            this.setCurrentContent(contentID);
            return null;
        }
        this.setState({ mediaIndex: 0 }, () => this.slider.slickGoTo(0));
        this.setCurrentContent(this.state.videos[0].id);
        return null;
    };

    setVideoRef = (val) => {
        this.setState({
            video: val,
        });
    };

    fetchMedia = () => {
        const { params: { type, contentID }, currentCompany } = this.props;
        const contentType = currentCompany ? currentCompany.id : 0;
        this.setState({
            loading: true,
            videos: [],
            mediaIndex: 0,
        }, () => {
            axios("get", PROMO.contentUrl(contentType, type))
                .then((data) => {
                    if (data.payload.length > 0) {
                        this.setState({ videos: data.payload, loading: false }, () => {
                            this.getContentId(contentID);
                        });
                    } else {
                        this.setState({ loading: false });
                    }
                }).catch(() => {
                    this.setState({ loading: false });
                });
        });
    };

    setNewMediaIdnex = (val) => {
        this.setState({ mediaIndex: val });
    };

    setCurrentContent = (media) => {
        const { params: { companySlug, type } } = this.props;
        const url = `/${companySlug}/promo/${type}/${media}`;
        this.props.history.replace(url);
    };

    renderSlider = (videos, mediaIndex, mWidth, type) => (
        <Slider
            ref={(slider) => { this.slider = slider; }}
            {...sliderSettings(this.props.classes, this.setNewMediaIdnex, this.video)}>
            {
                videos.map((file, i) => (
                    <React.Fragment key={String(i)}>
                        <VideoPlayer
                            maxWidth={`${mWidth}px`}
                            loop={type === "stream"}
                            src={file.src.src}
                            ref={mediaIndex === i ? this.video : null}
                            preload="metadata" />
                    </React.Fragment>
                ))
            }
        </Slider>
    );

    render() {
        const {
            classes, params, history, screenY, screenX,
        } = this.props;
        const {
            videos, mediaIndex, loading,
        } = this.state;
        const mWidth = screenY / 0.76;
        return (
            <div className={classes.videoTabWrapper}>
                <div className={classes.videoTabContainer}>
                    <div className={classes.mainContentWrapper}>
                        <div className={classNames(classes.mainContentBox)}>
                            <div className={classes.adaptiveBox}>
                                {
                                    !loading
                                        ? this.renderSlider(videos, mediaIndex, mWidth, params.type)
                                        : <Loader />
                                }
                            </div>
                        </div>
                    </div>
                    <div className={classes.itemsContentWrapper}>
                        {
                            videos.length > 0 && (
                                <Carousel
                                    screenX={screenX}
                                    screenY={screenY}
                                    loading={loading}
                                    media={videos}
                                    mediaIndex={mediaIndex}
                                    history={history}
                                    params={params} />
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Promo);
