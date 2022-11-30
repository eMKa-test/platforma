import React from "react";
import { withStyles } from "@material-ui/core/styles/index";
import styles from "./style";
import { toDeg } from "../helpers";

const renderRanges = (classes, currentIcon) => (
    <React.Fragment>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={currentIcon}>
                { currentIcon === classes.southIcon ? "S" : "N" }
            </span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
        <div className={classes.compassRangeItems}>
            <span className={classes.separateRange}>|</span>
        </div>
    </React.Fragment>
);

const CompassRange = ({
    classes,
    shift,
    size,
}) => {
    const count = toDeg(shift);
    function correctShift() {
        const views = toDeg(shift) >= 0 || toDeg(shift) <= 90 ? toDeg(shift) : 180 + toDeg(shift);
        let convertShift = views / 180 * 200;
        let result;
        if (views >= 90 && views <= 180) {
            if (convertShift >= 0) {
                convertShift = -1 * (200 - convertShift);
            } else {
                convertShift = 200 + convertShift;
            }
            result = -97 - (convertShift);
        } else if (views >= -180 && views <= -90) {
            convertShift = 200 + convertShift + 6.5;
            result = -90 - (convertShift);
        } else {
            result = -93.5 - (convertShift);
        }
        return `${result}%`;
    }
    const currentIcon = count <= -90 || count >= 90 ? classes.southIcon : classes.northIcon;
    return (
        <div
            className={classes.compassRangeWrapper}>
            <div
                style={{
                    left: `${correctShift()}`,
                    width: `${size * 3}px`,
                }}
                className={classes.adaptiveRanges}>
                {
                    renderRanges(classes, currentIcon)
                }
            </div>
        </div>
    );
};

export default withStyles(styles)(CompassRange);
