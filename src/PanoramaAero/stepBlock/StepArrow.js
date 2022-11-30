import React from "react";
import * as PropTypes from "prop-types";
import { ARROW_SIZE, ARROW_SIZE_WV,  } from "../constant";
import { getCoordsStepBlock } from "../helpers";
import arrowIcon from "../assets/arrowUp.svg";

const StepArrow = ({
    switchSublineScene, arrowProps: { yaw: arrowYaw, id: arrowId }, webview,
}) => {
    const result = getCoordsStepBlock(arrowYaw);
    return (
        <button
            type="button"
            className="wrapper-arrow"
            onClick={() => switchSublineScene(arrowId)}
            style={{
                width: `${webview ? ARROW_SIZE_WV : ARROW_SIZE}px`,
                left: `${result.x}px`,
                top: `${result.y}px`,
                transform: `rotate(${result.arrowAngle}deg)`,
            }}>
            <img
                src={arrowIcon}
                alt="step" />
        </button>
    );
};

StepArrow.propTypes = {
    switchSublineScene: PropTypes.func.isRequired,
    webview: PropTypes.bool,
    arrowProps: PropTypes.objectOf(PropTypes.number.isRequired).isRequired,
};

export default React.memo(StepArrow);
