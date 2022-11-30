import React, { useEffect } from "react";
import * as PropTypes from "prop-types";
import { toDeg, toRoundNum } from "./helpers";

function calcDelta(one, two) {
    let result = two - one;
    if (one <= 180 && one >= 0) {
        if (result > 0 && result >= 180 && two >= 180) {
            result = (two - 360) - one;
        }
    } else {
        if (two >= 0 && two <= 180) {
            result = (360 - one) + two;
            if (result > 180) {
                result = result - 360;
            }
        } else {
            result = two - one;
        }
    }
    return toRoundNum(result);
}

function convertRotate(val) {
    return val >= 0 && val <= 180 ? val : 360 + val;
}

const SeparateControl = ({
    view, setPanProp, startEdit, yaw,
}) => {
    useEffect(() => {
        const result = startEdit === 0 ? 0 : calcDelta(convertRotate(toDeg(startEdit)), convertRotate(toDeg(yaw)));
        setPanProp("correctAngel", result);
    }, [yaw]);

    const coords = view.coordinatesToScreen({ yaw: startEdit, pitch: 0 });
    const shiftXLast = coords ? toRoundNum(coords.x / view._width * 100) : 0;

    return (
        <React.Fragment>
            <span
                className="correct-pan_separate__last-pos"
                style={{ left: `${shiftXLast}%` }} />
        </React.Fragment>
    );
};

SeparateControl.propTypes = {
    view: PropTypes.object.isRequired,
    setPanProp: PropTypes.func.isRequired,
    startEdit: PropTypes.number.isRequired,
};

export default SeparateControl;
