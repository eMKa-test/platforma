import React from "react";
import loadIcon from "../assets/loader.svg";

export default ({ loaded }) => (
    <div
        className={`model-stub ${loaded ? "model-stub_hide" : "model-stub_show"}`}>
        <img src={loadIcon} alt="loadIcon" />
        <span className="model-stub__value">Загрузка...</span>
    </div>
);
