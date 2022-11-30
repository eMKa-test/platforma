import React from "react";
import spinner from "./assets/spinner.svg";

export const convertType = (type) => {
    switch (type) {
        case "IMAGE":
            return "Фото";
        case "VIDEO":
            return "Видео";
        case "PANORAMA":
            return "Панорамы";
        case "AERIAL":
            return "Аэросъёмки";
        default:
            break;
    }
};

export const Spin = () => (
    <div
        className="spinner-fsize">
        <img
            className="info-done__loader"
            src={spinner}
            alt="spin" />
    </div>
);

export const panelBg = {
    default: {
        background: "#c2effc",
    },
    success: {
        background: "#c3f5cc",
    },
    warning: {
        background: "#fbfcc2",
    },
    alert: {
        background: "#fcc2c2",
    },
};

export const uniqueArray = (arr) => {
    const obj = {};
    for (let i = 0; i < arr.length; i += 1) {
        const str = arr[i];
        obj[str] = true;
    }
    return Object.keys(obj);
};

export default {
    convertType,
    uniqueArray,
    Spin,
    panelBg,
};
