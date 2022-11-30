import React from "react";
import memoize from "lodash/memoize";
import isEmpty from "lodash/isEmpty";
import UA from "ua-parser-js";

export const arrayOrState = (payload, state = []) => {
    if (!(payload instanceof Array)) {
        return state;
    }
    return [...payload];
};

export const objectOrState = (payload, state = {}) => {
    if (typeof payload !== "object" || Object.is(payload, null) || payload instanceof Array) {
        return state;
    }
    return { ...payload };
};

export const substr = (text = "", lim = 200) => {
    if (text.length > lim) {
        return `${text.substr(0, lim)}...`;
    }
    return text;
};

// наличие тача у клиента
export function touchDevice() {
    return "ontouchstart" in window;
}

export const substrClever = (text = "") => {
    const limit = Math.round(text.length * 0.2);
    const pass = Math.round(text.length * 0.4);
    const leftPart = text.substr(0, limit);
    const rightPart = text.substr(limit + pass, text.length);
    return `${leftPart}...${rightPart}`;
};

export function fullScreenElem(index) {
    if (!document.fullscreenElement) {
        const elem = document.querySelector(`.${index}`);
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        }
    }
}

export function preloadContent(body = "Загрузка") {
    return (
        <div className="loaderWrap">
            <div className="loaderWrapChild" />
            <span>
                {body}
                {" "}
                {" "}
                <i className="loader-dot_1">.</i>
                <i className="loader-dot_2">.</i>
                <i className="loader-dot_3">.</i>
            </span>
        </div>
    );
}

export function convertDetails(contentName) {
    switch (contentName) {
        case "IMAGE":
            return "Фото";
        case "PANORAMA":
            return "Панорам";
        case "VIDEO":
            return "Видео";
        case "AERIAL":
            return "Аэро";
        default:
            return "undefined";
    }
}

export function convertStatus(status) {
    switch (status) {
        case "UPLOADED":
            return "Загружено";
        case "UPLOADING":
            return "В процессе";
        default:
            return null;
    }
}

export function convertDate(date, type = "") {
    if (date !== undefined) {
        const months = [
            "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
            "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря",
        ];
        const x = date.split("-").reverse();
        if (type === "admin") {
            return x.join("/");
        }
        const currentMonth = months[Number(x[1] - 1)];
        x.splice(1, 1, currentMonth);
        return x.join(" ");
    }
    return null;
}

export function sortPans(valA, valB) {
    if (valA.pointId && valB.pointId) {
        return valA.pointId - valB.pointId;
    }
    return valA.id - valB.id;
}

// Панорамы
export function toRad(deg) {
    return (deg * Math.PI) / 180;
}

export function toDeg(rad) {
    return (rad * 180) / Math.PI;
}

export function bearing({ gps: { long: lng1, lat: lat1 } }, { gps: { long: lng2, lat: lat2 } }) {
    const dLon = (lng2 - lng1);
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const brng = toDeg(Math.atan2(y, x));
    // TODO: вот тут надо начальную поправку внести и будет хорошо считать
    return (360 - ((brng + 360) % 360));
}

export function bearingSerega([lng1, lat1], [lng2, lat2]) {
    const correctLng1 = lng1 * Math.cos(lat1);
    const correctLng2 = lng2 * Math.cos(lat1);
    const siblingPoint = Math.acos(Math.abs(lat2 - lat1)
        / Math.sqrt((lat2 - lat1) * (lat2 - lat1) + (correctLng2 - correctLng1)
            * (correctLng2 - correctLng1)));
    if (correctLng2 < correctLng1) {
        return toRad(180 - siblingPoint);
    }
    return siblingPoint;
}

export function setRadiusPan({ gps: { long: lng1, lat: lat1 } }, { gps: { long: lng2, lat: lat2 } }) {
    const delta = ((lat2 - lat1) ** 2) + ((lng2 - lng1) ** 2);
    return Math.sqrt(delta);
}

export function getDistanceMarker([lng1, lat1], [lng2, lat2]) {
    const EARTH = 40000000 / 360;
    const correct = EARTH * Math.cos(toRad(lng1));
    const result = Math.sqrt((((lng2 - lng1) * EARTH) ** 2) + (((lat2 - lat1) * correct) ** 2));
    return Math.round(result);
}

export const formatDate = memoize((date) => moment(date).format("DD.MM.YYYY HH:mm"));

export const getBrowser = memoize((userAgent) => {
    const parser = new UA();
    parser.setUA(userAgent);
    const { browser, os } = parser.getResult();
    const { version = "", name } = browser;
    return `${os.name || "ОС не определена"} - ${name || "Браузер не определен"} ${version.substr(0, 2)}`;
});

export const getAppInfo = memoize((userAgent) => {
    try {
        const json = JSON.parse(userAgent);
        if (!isEmpty(json)) {
            /*
            app: {
              version: версия
              build: сборка
            }
            os: {
              name: Операционная система (iOS)
              version: Версия (12.1.1)
            device: {
                name: iPhone, Galaxy
                model: SE, 9, s9 ...
            }
             */
            const { app, os, device } = json;
            const str = [
                !isEmpty(app) ? `${app.version}${app.build}` : "не известна",
                !isEmpty(os) ? `${os.name}/${os.version}` : "ОС не определена",
                !isEmpty(device) ? `${os.name}/${os.version}` : "Устройство не определено",
            ];
            return `Версия приложения: ${str.join(" - ")}`;
        }
    } catch (e) {
        warn(e.message);
    }
    return "Ошибка определения устройства";

});

export default {
    arrayOrState,
    objectOrState,
    substr,
    convertDate,
    substrClever,
    sortPans,
    touchDevice,
    bearing,
    bearingSerega,
    toDeg,
    toRad,
    setRadiusPan,
    getDistanceMarker,
};
