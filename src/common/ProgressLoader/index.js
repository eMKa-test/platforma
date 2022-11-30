import React from "react";
import * as PropTypes from "prop-types";
import "./style.css";

const ProgressLoaderOne = ({ loaded, progress }) => {
    console.log(progress);
    return (
        <div className={`model3d-container ${!loaded ? "model3d-hide" : "model3d-show"}`}>
            <div className="model3d-loader">
            <span
                className="model3d-loader-progressbar"
                style={{ width: `${progress}%` }} />
                <span className="model3d-loader-progress">
                {`${progress}%`}
            </span>
            </div>
        </div>
    );
}

const ProgressLoader = ({ progress }) => {
    return (
        <div className="progress-loader-container">
            {`${progress}%`}
        </div>
    );
}

ProgressLoader.propTypes = {
    progress: PropTypes.number.isRequired,
};

export default ProgressLoader;
