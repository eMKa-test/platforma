import React from "react";
import loadIcon from "../assets/loader.svg";

export default ({ loaded }) => (
    <div
        className={`aero-stub ${loaded ? "aero-stub_hide" : "aero-stub_show"}`}>
        <img src={loadIcon} alt="loadIcon" />
        <span className="aero-stub__value">Загрузка...</span>
    </div>
);
