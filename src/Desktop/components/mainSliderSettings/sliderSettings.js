import React from "react";
import classNames from "classnames";
import LeftSlideArrow from "@material-ui/icons/ArrowBackIos";
import RightSlideArrow from "@material-ui/icons/ArrowForwardIos";
import { MAIN_SLIDE_SPEED } from "../../../constants";

const PrevArrow = (props) => {
    const {
        onAction,
        classes,
        onClick,
    } = props;
    return (
        <button
            type="button"
            onClick={() => {
                if (typeof onAction === "function") {
                    onAction();
                }
                onClick();
            }}
            className={classNames(classes.selectButtonItem, classes.buttonPreviousItem)}>
            <LeftSlideArrow color="secondary" />
        </button>
    );
};

const NextArrow = (props) => {
    const {
        /**
         * Кастомный onClick перетирается в слайдере
         *
         */
        onAction,
        classes,
        onClick,
    } = props;
    return (
        <button
            type="button"
            onClick={() => {
                if (typeof onAction === "function") {
                    onAction();
                }
                onClick();
            }}
            className={classNames(classes.selectButtonItem, classes.buttonNextItem)}>
            <RightSlideArrow color="secondary" />
        </button>
    );
};

export const sliderSettings = (classes, setNewMediaIdnex, pauseCB, onAction) => ({
    dots: false,
    infinite: false,
    fade: false,
    lazyLoad: true,
    speed: MAIN_SLIDE_SPEED,
    slidesToScroll: 1,
    slidesToShow: 1,
    beforeChange: (i, next) => {
        if (pauseCB && pauseCB.current) {
            pauseCB.current.pause();
        }
        setNewMediaIdnex(next);
    },
    afterChange: () => {
        if (pauseCB && pauseCB.current) {
            pauseCB.current.play();
        }
    },
    onSwipe: () => {
        if (typeof onAction === "function") {
            onAction();
        }
    },
    nextArrow: <NextArrow
        classes={classes}
        onAction={onAction} />,
    prevArrow: <PrevArrow
        classes={classes}
        onAction={onAction} />,
});

export default null;
