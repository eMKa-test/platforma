import React from "react";
import * as PropTypes from "prop-types";
import stepIcon from "../../assets/icons/stepIcon.svg";

const AeroStepsGroup = ({ setNewIndex }) => (
    <div className="marz-container_step-group-btns">
        <button
            title="вперёд"
            type="button"
            className="step-group-btns__next"
            onClick={() => setNewIndex(1)}>
            <img
                src={stepIcon}
                alt="step forward" />
        </button>
        <button
            title="назад"
            type="button"
            className="step-group-btns__prev"
            onClick={() => setNewIndex(-1)}>
            <img
                src={stepIcon}
                alt="step back" />
        </button>
    </div>
);

AeroStepsGroup.propTypes = {
    setNewIndex: PropTypes.func.isRequired,
};

export default AeroStepsGroup;
