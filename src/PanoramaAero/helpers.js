import {
    ARROW_SIZE,
    STEP_PAN_RADIUS,
    SPOT_CLASSES_V2,
} from "./constant";
import logo from "./assets/logoGold.png";

export const jsonToObject = (meta, type) => {
    try {
        const res = JSON.parse(meta)[type];
        if (Array.isArray(res)) {
            return res;
        }
    } catch (e) {
        // console.warn("Parse error in meta aeropanorama", e.message);
    }
    return [];
};

function createZoneSpotStyle(item, checkCount) {
    const round = document.createElement("div");
    const centerRound = document.createElement("div");
    const separateBottom = document.createElement("div");
    const separateRight = document.createElement("div");
    const zoneName = document.createElement("div");
    round.classList.add("round");
    round.style.backgroundImage = `url(${logo})`;
    centerRound.classList.add("center-round");
    separateBottom.classList.add("separate-bottom");
    separateRight.classList.add("separate-right");
    zoneName.classList.add("aero-zone-name");
    zoneName.innerHTML = `${item.title}`;
    centerRound.appendChild(separateBottom);
    centerRound.appendChild(separateRight);
    round.appendChild(zoneName);
    if (!checkCount) {
        const zoneCount = document.createElement("div");
        zoneCount.classList.add("aero-zone-count");
        zoneCount.innerHTML = "Нет привязанных панорам за выбранную дату";
        round.appendChild(zoneCount);
    }
    round.appendChild(centerRound);
    return round;
}

function renderStep(scene, item, i, type, switchScene, checkCount) {
    const { yaw, pitch } = item;
    let infoBlock;
    if (type === "sublines") {
        infoBlock = createZoneSpotStyle(item, checkCount);
    } else {
        infoBlock = document.createElement("div");
        const spot = document.createElement("span");
        const icon = document.createElement("i");
        infoBlock.classList.add(SPOT_CLASSES_V2[type].container);
        icon.classList.add("fa", "fa-dot-circle-o");
        spot.classList.add(SPOT_CLASSES_V2[type].child);
        spot.appendChild(icon);
        infoBlock.appendChild(spot);
    }
    if ((type === "sublines" && checkCount > 0) || type === "aeropanoramas") {
        infoBlock.addEventListener("click", () => {
            switchScene(item.id);
        });
    }
    if (scene) {
        injectSpots(scene, infoBlock, yaw, pitch, type);
    }
}

function injectSpots(scene, dom, yaw, pitch) {
    if (scene) {
        scene.hotspotContainer()
            .createHotspot(dom, { yaw, pitch });
    }
}

const renderAeroPolygonSpot = (scene, polygon, switchScene, checkCount) => {
    const container = document.createElement("div");
    const info = document.createElement("div");
    info.classList.add("aero-polygon-description");
    const enterZone = document.createElement("button");
    enterZone.classList.add("aero-polygon-enter__button", "btn_like_div");
    enterZone.innerText = checkCount;
    info.innerText = polygon.title;
    container.appendChild(enterZone);
    container.appendChild(info);
    container.classList.add("aero-polygon");
    container.classList.add("aeropanorama__subline-polygon-spot");
    container.style.width = polygon.params.size.width;
    container.style.height = polygon.params.size.height;
    let transformString = "";
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, val] of Object.entries({ ...polygon.params.translate, ...polygon.params.rotation })) {
        transformString += `${key}(${val})`;
    }
    if (checkCount > 0) {
        enterZone.addEventListener("click", () => {
            switchScene(polygon.id);
        });
    }
    if (scene) {
        injectPolygonSpot(scene, container, { params: polygon.params, transform: transformString });
    }
};

function injectPolygonSpot(scene, dom, { params, transform }) {
    scene.hotspotContainer()
        .createHotspot(dom,
            { ...params.coord },
            {
                perspective: {
                    radius: params.radius.radius,
                    extraTransforms: transform,
                },
            });
}

export function createSteps(scene, stepType, switchScene, sublinePansCount) {
    const switchSceneWithContext = switchScene.bind(this);
    if (scene && Array.isArray(scene.spots[stepType]) && scene.spots[stepType].length > 0) {
        scene.spots[stepType].forEach((step, i) => {
            let count = 0;
            if (sublinePansCount) {
                const check = sublinePansCount.find((sub) => sub.id === step.id);
                count = check && check.panoramas ? check.panoramas.length : 0;
            }
            if (stepType === "sublinePolygons") {
                renderAeroPolygonSpot(scene.scene, step, switchScene, count);
            } else {
                renderStep(scene.scene, step, i, stepType, switchSceneWithContext, count);
            }
        });
    }
}

export function prepareJSONMeta(meta) {
    let parsed = {};
    if (meta && typeof meta === "string") {
        try {
            parsed = JSON.parse(meta);
        } catch (e) {
            console.error("Error parse meta", e);
        }
    }
    return {
        aeropanoramas: parsed.aeropanoramas || [],
        sublines: parsed.sublines || [],
        sublinePolygons: parsed.sublinePolygons || [],
    };
}

export const substr = (text = "", lim = 200) => {
    if (text.length > lim) {
        return `${text.substr(0, lim)}...`;
    }
    return text;
};

export function sortPans(valA, valB) {
    if (valA.pointId && valB.pointId) {
        return valA.pointId - valB.pointId;
    }
    return valA.id - valB.id;
}

export function sortScenes(sceneA, sceneB) {
    return sceneA.id - sceneB.id;
}

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

export function getSublinesBySublineId(panoramas, subs) {
    const sublinesOnScene = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, val] of panoramas.entries()) {
        if (val.sublineId && Array.isArray(val.sublineId) && val.sublineId.length > 0) {
            val.sublineId.forEach((sub) => {
                for (let i = 0; i < subs.length; i++) {
                    if (subs[i].id === sub) {
                        const subIndex = sublinesOnScene.findIndex((el) => el.id === sub);
                        if (subIndex !== -1) {
                            sublinesOnScene[subIndex].panoramas.push(val);
                            sublinesOnScene[subIndex].panoramas.sort(sortPans);
                        } else {
                            sublinesOnScene.push({
                                id: sub,
                                gps: subs[i].gps,
                                panoramas: [val].sort(sortPans),
                            });
                        }
                    }
                }
            });
        }
    }
    return sublinesOnScene;
}

export function findIndex(array, contentID = 0) {
    if (Array.isArray(array)) {
        const result = array.findIndex((elem) => elem.id === Number(contentID));
        return result === -1 ? 0 : result;
    }
    return 0;
}

export function getSiblingPans(scenes, index) {
    const result = [];
    for (let i = 0; i <= scenes.length - 1; i += 1) {
        if (index === 0) {
            if (i === 1 || i === scenes.length - 1) {
                result.push(scenes[i]);
            }
        } else if (index === scenes.length - 1) {
            if (i === index - 1 || i === 0) {
                result.push(scenes[i]);
            }
        } else if (i === index - 1 || i === index + 1) {
            result.push(scenes[i]);
        }
    }
    return result;
}

export function getCoordsStepBlock(angle, radius = STEP_PAN_RADIUS / 1.5) {
    return {
        x: Number(radius * (Math.cos(angle)).toFixed(8)) - ARROW_SIZE / 2,
        y: Number(radius * (Math.sin(angle)).toFixed(8)) - ARROW_SIZE / 2,
        arrowAngle: toDeg(angle) - 360 + 90,
    };
}

export function sortById(panA, panB) {
    if (panA && panB && panA.id && panB.id) {
        return panA.id - panB.id;
    }
    return false;
}

export function takeObjectFromArray(array, value, prop = "index", params = []) {
    if (Array.isArray(array) && typeof value === "number") {
        let result = array.find((arr) => arr[prop] === value);
        if (Array.isArray(params) && params.length > 0) {
            const resultWithKeys = {};
            for (const [key, val] of Object.entries(result)) {
                if (params.includes(key)) {
                    resultWithKeys[key] = val;
                }
            }
            result = resultWithKeys;
        } else if (typeof params === "string") {
            return result[params] || false;
        }
        return result || false;
    }
    return false;
}

export function checkDirection(panId, id) {
    if (panId !== id && id && panId) {
        return panId < id ? 1 : -1;
    }
    return 0;
}

export function findIndexById(array, id) {
    if (Array.isArray(array) && typeof id === "number") {
        const result = array.findIndex((item) => item.id === id);
        return result >= 0 ? result : false;
    }
    return false;
}

export function clearOwnProperties(obj) {
    // eslint-disable-next-line no-restricted-syntax
    for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            obj[prop] = undefined;
        }
    }
}

export default null;
