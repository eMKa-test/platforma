import React from "react";
import * as PropTypes from "prop-types";
import stepIcon from "../../assets/icons/stepIcon.svg";

const StepsGroup = ({ setNewIndexFromKeys }) => (
    <div className="marz-container_step-group-btns">
        <button
            type="button"
            className="step-group-btns__next"
            onClick={() => setNewIndexFromKeys(1)}>
            <img
                src={stepIcon}
                alt="step forward" />
        </button>
        <button
            type="button"
            className="step-group-btns__prev"
            onClick={() => setNewIndexFromKeys(-1)}>
            <img
                src={stepIcon}
                alt="step back" />
        </button>
    </div>
)

StepsGroup.propTypes = {
    setNewIndexFromKeys: PropTypes.func.isRequired,
}

export default StepsGroup;
