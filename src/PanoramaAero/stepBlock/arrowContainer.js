import React from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import { ARROWS_PITCH, STEP_PAN_RADIUS } from "../constant";
import StepArrow from "./StepArrow";
import "./style.css";

function setVerticalTransform(pitch) {
    const calcPitchArrows = 1.1 - pitch / 2;
    let setRoundPlace = calcPitchArrows;
    if (calcPitchArrows >= ARROWS_PITCH.max) {
        setRoundPlace = ARROWS_PITCH.max;
    } else if (calcPitchArrows <= ARROWS_PITCH.min) {
        setRoundPlace = ARROWS_PITCH.min;
    }
    return `translate(-50%, 10%)rotate3d(1,0,0,${setRoundPlace}rad)rotate(-90deg)`;
}

function createArrow({ id, yaw }) {
    return { id, yaw };
}

class ArrowContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrowBack: null,
            arrowForward: null,
        };
    }

    componentDidMount() {
        this.mathTransformRotate();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.subPanIndex !== this.props.subPanIndex) {
            this.mathTransformRotate();
        }
    };

    mathTransformRotate = () => {
        const { subPanOnScenes } = this.props;
        if (Array.isArray(subPanOnScenes) && subPanOnScenes.length > 0) {
            if (subPanOnScenes.length === 1) {
                this.setState({
                    arrowForward: createArrow(subPanOnScenes[0]),
                });
            } else {
                this.setState({
                    arrowBack: createArrow(subPanOnScenes[0]),
                    arrowForward: createArrow(subPanOnScenes[1]),
                });
            }
        }
        return null;
    }

    render() {
        const { arrowBack, arrowForward } = this.state;
        const { yaw, pitch, subPanOnScenes, webview } = this.props;
        const count = subPanOnScenes.length;
        return (
            <div
                className={`${webview ? "wrapper-step-block_webview" : "wrapper-step-block"} ${count >= 1 ? "block__show" : "block__hide"}`}
                style={{
                    width: `${webview ? (STEP_PAN_RADIUS * 1.5) : (STEP_PAN_RADIUS * 2)}px`,
                    height: `${webview ? (STEP_PAN_RADIUS * 1.5) : (STEP_PAN_RADIUS * 2)}px`,
                    transform: setVerticalTransform(pitch),
                }}>
                <div
                    className={classNames(
                        "container-step-block",
                    )}
                    style={{ transform: `rotate3d(0,0,1,${yaw * -1}rad)` }}>
                    <div className="adaptive-steps">
                        {
                            arrowBack && (
                                <StepArrow
                                    arrowProps={arrowBack}
                                    {...this.props} />
                            )
                        }
                        {
                            arrowForward && (
                                <StepArrow
                                    arrowProps={arrowForward}
                                    {...this.props} />
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }
}

ArrowContainer.propTypes = {
    subPanIndex: PropTypes.number.isRequired,
    subPanOnScenes: PropTypes.array.isRequired,
    pitch: PropTypes.number.isRequired,
    yaw: PropTypes.number.isRequired,
};

export default ArrowContainer;
