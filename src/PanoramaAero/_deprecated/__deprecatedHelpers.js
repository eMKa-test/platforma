import { toDeg, toRad, toRoundNum } from "./helpers";

export function bearingSerega([lng1, lat1], [lng2, lat2]) {
    const correctLng1 = lng1 * Math.cos(lat1);
    const correctLng2 = lng2 * Math.cos(lat1);
    const a = lat2 - lat1;
    const b = correctLng2 - correctLng1;
    const siblingPoint = Math.acos(Math.abs(a) / Math.sqrt(((a) * (a)) + ((b) * (b))));
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

export function uniqContent(arr, compareName) {
    const result = arr.reduce((acc, cur) => {
        if (!acc.find((el) => el[compareName] === cur[compareName])) {
            acc.push(cur);
        }
        return acc;
    }, []);
    return result;
}

export function convertToSphereAngle(yaw) {
    return toDeg(yaw) < 0 && toDeg(yaw) >= -180
        ? toRoundNum(360 + toDeg(yaw))
        : toRoundNum(toDeg(yaw));
}

export function convertRotate(val) {
    return val >= 0 && val <= 180 ? val : 360 + val;
}

export function checkLoadedScene(scenes, index) {
    return scenes.find((scene) => scene.index === index);
}

export function checkIncludes(item, side) {
    return side.find((el) => item.index === el.index);
}

export function behindSceneAngle(look, { yaw }) {
    const views = toDeg(look) > 0 ? toDeg(look) : 360 + toDeg(look);
    const item = toDeg(yaw) % 360;
    const delta = views - item;
    return delta < 0 ? 360 + delta : delta;
}

export const substrClever = (text = "") => {
    const limit = Math.round(text.length * 0.2);
    const pass = Math.round(text.length * 0.4);
    const leftPart = text.substr(0, limit);
    const rightPart = text.substr(limit + pass, text.length);
    return `${leftPart}...${rightPart}`;
};

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

export function convertDate(date, type = "") {
    if (date !== undefined) {
        const months = [
            "Января", "Февраля", "Марта",
            "Апреля", "Мая", "Июня",
            "Июля", "Августа", "Сентября",
            "Октября", "Ноября", "Декабря",
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
