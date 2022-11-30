import React, { useState, useEffect } from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import uniqueId from "lodash/uniqueId";
import { withStyles } from "@material-ui/core";
import step from "../assets/arrowUp.svg";
import { getCoordsStepBlock } from "../helpers";
import { STEP_PAN_RADIUS, ARROWS_PITCH, ARROW_SIZE } from "../constant";
import styles from "./style";

function setVerticalTransform(pitch) {
    const calcPitchArrows = 1.1 - pitch / 2;
    let setRoundPlace = calcPitchArrows;
    if (calcPitchArrows >= ARROWS_PITCH.max) {
        setRoundPlace = ARROWS_PITCH.max;
    } else if (calcPitchArrows <= ARROWS_PITCH.min) {
        setRoundPlace = ARROWS_PITCH.min;
    }
    return `translate(-50%, 0%)rotate3d(1,0,0,${setRoundPlace}rad)rotate(-90deg)`;
}

const StepBlock = ({
                       classes, stepNextPan, subsOnSlide, view,
                   }) => {
    const [yaw, setYaw] = useState(0);
    const [pitch, setPitch] = useState(0);

    const handleSetPanParams = () => {
        setYaw(view.yaw());
        setPitch(view.pitch());
    };

    useEffect(() => {
        view.addEventListener("change", handleSetPanParams);
        return () => {
            view.removeEventListener("change", handleSetPanParams);
        };
    });

    const coordsSteps = subsOnSlide.length > 0 ? subsOnSlide.map((pan) => pan.yaw) : [];

    return (
        <div
            className={classes.wrapperStepBlock}
            style={{
                width: `${STEP_PAN_RADIUS * 2}px`,
                height: `${STEP_PAN_RADIUS * 2}px`,
                transform: setVerticalTransform(pitch),
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
                                    onClick={() => stepNextPan(subsOnSlide[i].id, "zone")}
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
    view: PropTypes.object.isRequired,
    stepNextPan: PropTypes.func,
    subsOnSlide: PropTypes.array.isRequired,
};

export default withStyles(styles)(StepBlock);
