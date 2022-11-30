import React, { Component } from "react";
import * as PropTypes from "prop-types";
import { compose } from "recompose";
import { withStyles } from "@material-ui/core/styles";
import withWidth from "@material-ui/core/withWidth";
import Slider from "react-slick";
import classNames from "classnames";

import styles from "./styles";
import "./override.css";
import CloseBtn from "../../../common/buttons/close";
import FullscreenContent from "../../gallery/fullscreenContent";
import SliderArrow from "../../SliderArrow";
import { MATERIAL } from "../../../../constants";
import ThumbnailCard from "../../gallery/thumbnailCard";
import FloatCalendar from "../../../common/float-calendar";
import metrikaEvents, {PROMO_MONTH_SELECT} from "../../../../common/Metrika";

const settings = (slidesToShow) => ({
    dots: false,
    infinite: false,
    speed: 300,
    slidesToScroll: 1,
    slidesToShow,
    lazyLoad: true,
    swipeToSlide: true,
});

class HorizontalSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentId: 0,
            isFullscreen: false,
            isDragged: false,
            selectedMonth: null,
        };
    }

    fullscreenRef = React.createRef();

    componentDidMount() {
        document.addEventListener("fullscreenchange", this.onFullscreenChange);

    }

    componentWillUnmount() {
        document.removeEventListener("fullscreenchange", this.onFullscreenChange);
    }

    onFullscreenChange = () => {
        if (document.fullscreenElement === null && this.state.isFullscreen) {
            this.setState({ isFullscreen: false });
        }
    };

    beforeDrag = () => {
        this.setState({ isDragged: true }, () => {
            setTimeout(() => { this.setState({ isDragged: false }); }, 0);
        });
    };

    onSelectItem = (index) => {
        if (this.state.isDragged) {
            return;
        }
        this.fullscreenRef.current.requestFullscreen()
            .then(() => {
                this.setState({ currentId: index, isFullscreen: true });
            })
            .catch(() => {
                // ...
            });
    };

    handleClose = () => {
        document.exitFullscreen()
            .then(() => {
                // ...
            });
    };

    handleWidth = (width) => {
        switch (width) {
            case "xs":
                return 1;
            case "sm":
                return 2;
            case "md":
                return 3;
            case "lg":
                return 4;
            case "xl":
            default:
                return 5;
        }
    };

    handleSelectMonth = (m) => {
        this.setState({ selectedMonth: m }, () => {
            if (m) {
                metrikaEvents.emit(PROMO_MONTH_SELECT, {
                    selectedMonth: m.format("MMM YYYY"),
                    filterTitle: this.props.title,
                    companyName: this.props.currentCompany.name,
                });
            }
        });
    };

    filterMedia = (data) => {
        const { selectedMonth } = this.state;
        const date = moment(data.date);
        return (
            moment(selectedMonth).startOf("month").isBefore(date) &&
            moment(selectedMonth).endOf("month").isAfter(date)
        );
    };

    renderImageList = (content) => Array.isArray(content) && content.map((item, i) => (
        <ThumbnailCard
            key={item.id}
            width="auto"
            idx={i}
            onSelectImage={this.onSelectItem}
            item={item} />
    ));

    render() {
        let { mediaData } = this.props;
        if (mediaData.length === 0) {
            return null;
        }
        const {
            currentId, isFullscreen, selectedMonth,
        } = this.state;
        if (selectedMonth) {
            mediaData = mediaData.filter(this.filterMedia);
        }
        const {
            classes, title, width, filter,
        } = this.props;
        const slides = this.handleWidth(width);
        return (
            <div className={classes.sliderWrapper}>
                <div className={classes.titleWrapper}>
                    <div className={classes.title}>{title}</div>
                    {filter && filter.type === "MONTH" ? (
                        <FloatCalendar
                            content={this.props.mediaData /* здесь должен быть не отфильтрованный массив */}
                            onSelect={this.handleSelectMonth} />
                    ) : null}
                </div>
                <Slider
                    className={classNames(classes.innerSlider, "margin-left-mod")}
                    prevArrow={(
                        <SliderArrow
                            onClick={() => {}}
                            classes={classes}
                            direction="prev" />
                    )}
                    nextArrow={(
                        <SliderArrow
                            onClick={() => {}}
                            classes={classes}
                            direction="next" />
                    )}
                    {...settings(slides)}
                    beforeChange={this.beforeDrag}>
                    {this.renderImageList(mediaData)}
                </Slider>
                <div
                    data-test="fullscreen-container"
                    ref={this.fullscreenRef}>
                    {isFullscreen ? (
                        <div data-test="fullscreen-wrapper">
                            <CloseBtn onClick={this.handleClose} />
                            <FullscreenContent
                                idx={currentId}
                                content={mediaData}
                                contentType={MATERIAL} />
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}

HorizontalSlider.propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string,
    mediaData: PropTypes.array.isRequired,
    width: PropTypes.string.isRequired,
    filter: PropTypes.shape({
        type: PropTypes.string,
    }),
    currentCompany: PropTypes.object,
};

export default compose(
    withWidth(),
    withStyles(styles),
)(HorizontalSlider);
