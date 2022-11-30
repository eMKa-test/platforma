import React from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./style.css";
import pltfIcon from "./stubGold.png";

const Spinner = () => {
    return (
        <div className="spinner__wrapper">
            <div className="spinner__wrapper__container">
                <div className="spin-container_1">
                    <Loader
                        type="Oval"
                        color="#bea67c"
                        height={80}
                        width={80}
                        timeout={0} />
                    <img
                        className="spinner__wrapper__platforma-icon"
                        src={pltfIcon}
                        alt="platforma_icon" />
                </div>
                <div className="spin-container_2">
                    <Loader
                        type="Oval"
                        color="#bea67c"
                        height={80}
                        width={80}
                        timeout={0} />
                </div>
                <div className="spin-container_3">
                    <Loader
                        type="Oval"
                        color="#bea67c"
                        height={80}
                        width={80}
                        timeout={0} />
                </div>
            </div>
        </div>
    );
};

export default Spinner;
