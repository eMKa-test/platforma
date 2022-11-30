import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import way from "../../Desktop/assets/icons/radarNextPan.svg";
import findLook from "../../Desktop/assets/icons/findPan.svg";
import styles from "./styles";
import { toDeg } from "../helpers";

const PanItem = React.memo(({
    classes, pano, view, yaw, index,
    stepNextPan, changeView,
}) => {
    function getShiftFromLook(rad, look) {
        const sizeX = view.size().width;
        const spot = view.coordinatesToScreen({ yaw: rad.yaw, pitch: 0 });
        if (spot) {
            const result = spot.x / sizeX * 100;
            return `${result}%`;
        }
        const views = toDeg(look) > 0 ? toDeg(look) : 360 + toDeg(look);
        const item = toDeg(rad.yaw);
        if (views - item < 175) {
            return "-5%";
        }
        return "102%";
    }

    const shiftYaw = getShiftFromLook(pano, yaw);
    return (
        <React.Fragment>
            <div
                style={{
                    left: shiftYaw,
                }}
                className={classes.radarItemWrapperWay}>
                <button
                    type="button"
                    title={index < pano.id ? "вперёд" : "назад"}
                    onClick={() => stepNextPan(pano.panoram.id)}
                    className={classes.wrapperContentItemsPan}>
                    <img
                        className={classNames(
                            classes.contentItemsWay,
                            {
                                [classes.iconForPreviousPan]: pano.id < index,
                            },
                        )}
                        src={way}
                        alt="pan stepWay" />
                </button>
            </div>
            {
                (pano.id > index) && (shiftYaw === "102%" || shiftYaw === "-5%") && (
                    <button
                        type="button"
                        title="перейти к следующей панораме"
                        onClick={() => changeView(pano)}
                        className={classNames(classes.setLook)}>
                        <img
                            src={findLook}
                            alt="pan next" />
                    </button>
                )
            }
            {
                (pano.id < index) && (shiftYaw === "102%" || shiftYaw === "-5%") && (
                    <button
                        type="button"
                        title="перейти к предыдущей панораме"
                        onClick={() => changeView(pano)}
                        className={classNames(classes.setLook)}>
                        <img
                            src={findLook}
                            alt="pan prev" />
                    </button>
                )
            }
        </React.Fragment>
    );
});

export default withStyles(styles)(PanItem);
