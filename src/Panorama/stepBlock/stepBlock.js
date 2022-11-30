import React from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import uniqueId from "lodash/uniqueId";
import { withStyles } from "@material-ui/core";
import step from "../assets/arrowUp.svg";
import { getCoordsStepBlock } from "../helpers";
import { STEP_PAN_RADIUS, ARROWS_PITCH, ARROW_SIZE } from "../constant";
import styles from "./style";

const StepBlock = ({
                       classes, stepNextPan, pansOnSlide, yaw, pitch,
                   }) => {
    const coordsSteps = pansOnSlide.length > 0 ? pansOnSlide.map((pan) => pan.yaw) : [];
    const calcPitchArrows = 1.1 - pitch / 2;
    let setRoundPlace = calcPitchArrows;

    if (calcPitchArrows >= ARROWS_PITCH.max) {
        setRoundPlace = ARROWS_PITCH.max;
    } else if (calcPitchArrows <= ARROWS_PITCH.min) {
        setRoundPlace = ARROWS_PITCH.min;
    }

    return (
        <div
            className={classes.wrapperStepBlock}
            style={{
                width: `${STEP_PAN_RADIUS * 2}px`,
                height: `${STEP_PAN_RADIUS * 2}px`,
                transform: `translate(-50%, -${pitch * 10}%)rotate3d(1,0,0,${setRoundPlace}rad)rotate(-90deg)`,
            }}>
            <div
                className={classNames(
                    classes.containerStepBlock,
                    {
                        [classes.showArrows]: coordsSteps.length > 0,
                        [classes.hideArrows]: coordsSteps.length === 0,
                    }
                )}
                style={{ transform: `rotate3d(0,0,1,${yaw * -1}rad)` }}>
                <div className={classes.adaptiveSteps}>
                    {
                        coordsSteps.length > 0 && coordsSteps.map((val, i) => {
                            const result = getCoordsStepBlock(val);
                            return (
                                <button
                                    key={uniqueId(`${val}_`)}
                                    type="button"
                                    className={classes.wrapperArrow}
                                    onClick={() => stepNextPan(pansOnSlide[i].id)}
                                    style={{
                                        width: `${ARROW_SIZE}px`,
                                        left: `${result.x}px`,
                                        top: `${result.y}px`,
                                        transform: `rotate(${result.arrowAngle}deg)`,
                                    }}>
                                    <img
                                        src={step}
                                        alt="step" />
                                </button>

                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
};

StepBlock.propTypes = {
    classes: PropTypes.object.isRequired,
    yaw: PropTypes.number.isRequired,
    pitch: PropTypes.number.isRequired,
    stepNextPan: PropTypes.func,
    pansOnSlide: PropTypes.array.isRequired,
};

export default withStyles(styles)(StepBlock);
