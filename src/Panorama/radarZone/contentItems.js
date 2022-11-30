import React, { useState } from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import imgIcon from "../../Desktop/assets/icons/imageIcon2.svg";
import videoIcon from "../../Desktop/assets/icons/videoIcon2.svg";
import styles from "./styles";
import {
    toDeg,
    checkIncludes,
    behindSceneAngle,
} from "../helpers";

const ContentItem = ({
    classes, img, view, yaw, openModalFromRadar,
    setContent, leftContent, rightContent, sortContent, resetSidesOnView,
}) => {
    const [showContentID, setThumbID] = useState(null);

    function getShiftFromLook(rad, look) {
        const sizeX = view.size().width;
        const spot = view.coordinatesToScreen({ yaw: rad.yaw, pitch: 0 });
        if (spot) {
            if (spot.x > 0 && spot.x < sizeX - 20) {
                if (checkIncludes(rad, leftContent)) {
                    resetSidesOnView(rad, leftContent, "left");
                }
                if (checkIncludes(rad, rightContent)) {
                    resetSidesOnView(rad, rightContent, "right");
                }
            } else {
                if (spot.x < 0 && !checkIncludes(rad, leftContent)) {
                    setContent(rad, "leftContent");
                }
                if (spot.x >= sizeX - 20 && !checkIncludes(rad, rightContent)) {
                    setContent(rad, "rightContent");
                }
            }
            const result = spot.x / sizeX * 100;
            return `${result}%`;
        }
        const angle = behindSceneAngle(look, rad);
        if (angle < 175) {
            if (leftContent.length === 0) {
                setContent(rad, "leftContent");
            }
            if (checkIncludes(rad, rightContent)) {
                sortContent(rad, rightContent, "right");
            }
            return "-6%";
        }
        if (rightContent.length === 0) {
            setContent(rad, "rightContent");
        }
        if (checkIncludes(rad, leftContent)) {
            sortContent(rad, leftContent, "left");
        }
        return "103%";
    }

    const toggleThumb = (id) => () => {
        setThumbID(id);
    };

    const shiftYaw = getShiftFromLook(img, yaw);
    return (
        <div
            style={{
                left: shiftYaw,
            }}
            onMouseEnter={toggleThumb(img.item.id)}
            onMouseLeave={toggleThumb(null)}
            className={classNames(
                classes.radarItemWrapper,
            )}>
            <div
                className={classNames(
                    classes.wrapperThumb,
                    {
                        [classes.showThumb]: showContentID === img.item.id,
                        [classes.hideThumb]: showContentID !== img.item.id,
                    },
                )}>
                <img
                    className={classes.thumbContent}
                    src={img.item.src.tmb}
                    alt="thumb" />
            </div>
            <button
                type="button"
                className={classes.wrapperContentItems}
                onClick={() => openModalFromRadar(img.item)}>
                <img
                    className={classes.contentItems}
                    src={img.item.type === "IMAGE" ? imgIcon : videoIcon}
                    alt="content type icon" />
            </button>
        </div>
    );
};

ContentItem.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    img: PropTypes.object.isRequired,
    view: PropTypes.object.isRequired,
    yaw: PropTypes.number.isRequired,
    openModalFromRadar: PropTypes.func.isRequired,
    setContent: PropTypes.func.isRequired,
    leftContent: PropTypes.array.isRequired,
    rightContent: PropTypes.array.isRequired,
    sortContent: PropTypes.func.isRequired,
    resetSidesOnView: PropTypes.func.isRequired,
};

export default withStyles(styles)(ContentItem);
