import classNames from "classnames";
import * as PropTypes from "prop-types";
import React from "react";
import LeftSlideArrow from "@material-ui/icons/ArrowBackIos";
import RightSlideArrow from "@material-ui/icons/ArrowForwardIos";

const SliderArrow = (props) => {
    const {
        onClick = () => {}, classes, direction = null, extraStyle,
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
            arrowStyle = classes.sliderArrowRight;
            arrowImage = <RightSlideArrow color="secondary" />;
            break;
        default:
            arrowStyle = null;
            arrowImage = null;
            break;
    }

    return (
        <button
            type="button"
            className={classNames(classes.sliderArrow, arrowStyle, extraStyle)}
            onClick={onClick}>
            {arrowImage}
        </button>
    );
};

SliderArrow.propTypes = {
    onClick: PropTypes.func,
    classes: PropTypes.object,
    extraStyle: PropTypes.string,
    direction: PropTypes.string.isRequired,
};

export default SliderArrow;
