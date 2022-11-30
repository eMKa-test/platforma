import React from "react";
import spinner from "Agent/assets/spinner.svg";

const SpinForLoad = () => (
    <div className="spin-loader-container">
        <img
            className="info-done__loader"
            src={spinner}
            alt="spin" />
    </div>
);

export default SpinForLoad;
