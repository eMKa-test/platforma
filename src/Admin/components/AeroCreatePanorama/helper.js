export const renderSpot = (closeF, createSpot, injectSpot) => {
    const rootDom = document.createElement("div");
    const aeroPan = document.createElement("div");
    const sublinePan = document.createElement("div");
    const closeSpot = document.createElement("span");
    rootDom.classList.add("aeropanorama__select-type-adder");
    aeroPan.classList.add("aeropanorama__type-aero", "aeropanorama__type");
    sublinePan.classList.add("aeropanorama__type-subline", "aeropanorama__type");
    closeSpot.classList.add("fa", "fa-times", "aeropanorama__type-close");
    closeSpot.addEventListener("click", () => {
        closeF(false);
    });
    aeroPan.addEventListener("click", () => {
        createSpot("aero");
    });
    sublinePan.addEventListener("click", () => {
        createSpot("zone");
    });
    aeroPan.innerText = "+аэро";
    sublinePan.innerText = "+зона";
    rootDom.appendChild(closeSpot);
    rootDom.appendChild(sublinePan);
    rootDom.appendChild(aeroPan);
    injectSpot(rootDom);
};

export const renderAeroSpot = (injectSpot, type) => {
    const rootDom = document.createElement("div");
    if (type === "aero") {
        rootDom.classList.add("aeropanorama__aero-spot");
    } else {
        rootDom.classList.add("aeropanorama__subline-spot");
    }
    injectSpot(rootDom);
};

export const renderAerosSpot = (injectSpot, type, params, switchAeroSceneFromSpot, deleteSpot) => {
    const rootDom = document.createElement("div");
    const controlSpot = document.createElement("div");
    const switchBtn = document.createElement("i");
    const deleteBtn = document.createElement("i");
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteSpot(params.id, type);
    });
    controlSpot.classList.add("aeropanorama__control-spot");
    controlSpot.appendChild(deleteBtn);
    if (type === "aero") {
        switchBtn.classList.add("fa", "fa-arrow-up", "aeropanorama__aero-spot-switch");
        controlSpot.appendChild(switchBtn);
        rootDom.classList.add("aeropanorama__aero-spot");
        switchBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            switchAeroSceneFromSpot(params.id);
        });
    } else {
        rootDom.classList.add("aeropanorama__subline-spot");
    }
    rootDom.innerText = params.id;
    deleteBtn.classList.add("aeropanorama__control-spot_delete", "fa", "fa-trash");
    rootDom.appendChild(controlSpot);
    injectSpot(rootDom, params);
};

export const renderAeroPolygonSpot = (injectSpot, polygon, switchAeroSceneFromSpot, deletePolygon, editPolygon) => {
    const container = document.createElement("div");
    const info = document.createElement("div");
    info.classList.add("aero-polygon-description");
    info.innerText = polygon.title;
    container.appendChild(info);
    container.classList.add("aero-polygon");
    container.style.width = polygon.params.size.width;
    container.style.height =polygon.params.size.height;
    let transformString = "";
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, val] of Object.entries({ ...polygon.params.translate, ...polygon.params.rotation })) {
        transformString += `${key}(${val})`;
    }
    const controlSpot = document.createElement("div");
    const deleteBtn = document.createElement("i");
    const editBtn = document.createElement("i");
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deletePolygon(polygon.id, "polygon");
    });
    editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        editPolygon(polygon);
    });
    controlSpot.classList.add("aeropanorama__control-polygon-spot");
    container.classList.add("aeropanorama__subline-polygon-spot");
    deleteBtn.classList.add("aeropanorama__control-polygon-spot_delete", "fa", "fa-remove");
    editBtn.classList.add("aeropanorama__control-polygon-spot_edit", "fa", "fa-wrench");
    controlSpot.appendChild(deleteBtn);
    controlSpot.appendChild(editBtn);
    container.appendChild(controlSpot);
    injectSpot(container, { params: polygon.params, transform: transformString});
};

export function ruleOfAddMeta(meta, id, title, coords, type, subMeta, gps = null) {
    let result;
    const params = gps ? { gps, ...coords } : { ...coords };
    if (meta) {
        if (meta[type]) {
            result = {
                ...meta,
                [type]: [
                    ...meta[type],
                    {
                        id,
                        title,
                        meta: subMeta,
                        params,
                    },
                ],
            };
        } else {
            result = {
                ...meta,
                [type]: [
                    {
                        id,
                        title,
                        meta: subMeta,
                        params,
                    },
                ],
            };
        }
    } else {
        result = {
            [type]: [
                {
                    id,
                    title,
                    meta: subMeta,
                    params,
                },
            ],
        };
    }
    return JSON.stringify(result);
}

export const ruleOfAddmetaPolygon = (meta, id, title, subMeta, gps, params) => {
    let result;
    const newPolygon = {
        id,
        title,
        meta: subMeta,
        gps,
        params,
    };
    if (meta) {
        if (meta.sublinePolygons) {
            let indexOfChangePolygon;
            if (meta.sublinePolygons.length > 0) {
                indexOfChangePolygon = meta.sublinePolygons.findIndex((sub) => sub.id === id);
                if (indexOfChangePolygon >= 0) {
                    meta.sublinePolygons.splice(indexOfChangePolygon, 1, newPolygon);
                    result = {
                        ...meta,
                        sublinePolygons: [
                            ...meta.sublinePolygons,
                        ],
                    };
                } else {
                    result = {
                        ...meta,
                        sublinePolygons: [
                            ...meta.sublinePolygons,
                            { ...newPolygon },
                        ],
                    };
                }
            } else {
                result = {
                    ...meta,
                    sublinePolygons: [
                        ...meta.sublinePolygons,
                        { ...newPolygon },
                    ],
                };
            }
        } else {
            result = {
                ...meta,
                sublinePolygons: [{ ...newPolygon }],
            };
        }
    } else {
        result = {
            sublinePolygons: [{ ...newPolygon }],
        };
    }
    return JSON.stringify(result);
};

export function ruleOfChangeMeta(meta, staySpots, type) {
    const result = {
        ...meta,
        [type]: [
            ...staySpots,
        ],
    };
    return JSON.stringify(result);
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
    return deg * Math.PI / 180;
}

export function toDeg(rad) {
    return rad * 180 / Math.PI;
}


export default null;
