/* eslint-disable */
import M from "marzipano";
import Events from "events";
import {
    toRad,
    toDeg,
    jsonToObject,
    createSteps,
    clearOwnProperties,
    findIndexById,
    takeObjectFromArray,
    getSublinesBySublineId,
    getSiblingPans,
    bearing,
    prepareJSONMeta,
} from "./helpers";
import { transitionStyle, opacity } from "./settings";

const changeLook = ({yaw, pitch}, scene) => {
    const lookAngle = toDeg(yaw) % 360;
    const resultAngle = lookAngle > 180 ? -Math.PI + toRad(lookAngle) - Math.PI : toRad(lookAngle);
    scene.lookTo({ yaw: resultAngle, pitch, fov: Math.PI }, { transitionDuration: 600, ease: transitionStyle().easeInOutQuart});
};

const eventFlip = new Events();
let cache = {
    aeropanoramas: [],
    sublines: [],
};
const options = {
    limiter: () => M.RectilinearView.limit.traditional(
        1024 * 3,
        toRad(100),
    ),
    initView: {
        yaw: -1.56,
        pitch: 0,
        fov: Math.PI,
    },
};

function Aero(idDomElement, onChangeScene) {
    this.onChangeScene = onChangeScene || null;
    this.dom = document.getElementById(idDomElement);
    this.currentAeroScene = null;
    this.aeroPanId = null;
    this.currentSubline = {};
    this.sublinesOnAeroWithPans = [];
    this.panOnSceneCount = 0;
    this.loadedAssets = 0;

    this.levelPan = 0;
    this.currentSubScene = {};
    this.subPanId = 0;
    this.subPanIndex = 0;
    this.sublineArrowStepPans = [];
    this.countSubPanSteps = 0;
    this.aeroLookPosition = {
        yaw: 0,
        pitch: 0,
    };
    this.geometry = new M.EquirectGeometry([{ width: "512px" }]);
    this.view = new M.RectilinearView(options.initView, options.limiter());
    this.yaw = 0;
    this.pitch = 0;
    this.viewer = new M.Viewer(this.dom);
    this.view.addEventListener("change", setYaw.bind(this, this.view));
}

Aero.prototype.loadContent = function(panoramas = [], sublines, contentID) {
    if (!this.viewer) {
        throw new Error("No Dom-container on Viewer");
    }
    if (!Array.isArray(panoramas) || panoramas.length === 0) {
        throw new Error("Not available aeropanorams array");
    }
    if (!contentID || !Number(contentID) && Number(contentID) !== 0) {
        throw new Error("No contentID");
    }
    this.panoramasList = panoramas;
    this.sublinesList = sublines;
    this.aeroPanId = Number(contentID);
    this.aeroPanIndex = findIndexById(this.panoramasList, this.aeroPanId) || 0;
    if (this.currentAeroScene) {
        const {id} = this.currentAeroScene;
        destroySpots.call(this, id);
    }
    loadAeroController.call(this, this.aeroPanIndex);
};

function loadAeroController(index = this.aeroPanIndex) {
    const curScene = this.panoramasList[index];
    let aroundAeroScenes = jsonToObject(curScene.meta, "aeropanoramas");
    let aeroPansOnScene = [curScene];
    if (aroundAeroScenes.length > 0) {
        aroundAeroScenes = this.panoramasList.filter((aero) => aroundAeroScenes.map((othersAero) => othersAero.id).includes(aero.id));
        aeroPansOnScene = [ ...aeroPansOnScene, ...aroundAeroScenes];
    }
    const pansForLoad = aeroPansOnScene.filter((pan) => pan && !cacheCheck(pan.id, "aeropanoramas"));
    this.panOnSceneCount = pansForLoad.length;
    createScene.call(this, pansForLoad, "aeropanoramas", setAeroSceneProperties);
}

function setAeroSceneProperties(scenes) {
    this.currentAeroScene = takeObjectFromArray(scenes, this.aeroPanId, "id");
    if (Array.isArray(this.currentAeroScene.spots.sublinePolygons)) {
        const { spots: { sublinePolygons: sublines } } = this.currentAeroScene;
        const subs = sublines.map((el) => ({ id: el.id, gps: el.gps || null }));
        this.sublinesOnAeroWithPans = getSublinesBySublineId(this.sublinesList, subs);
        if (this.sublinesOnAeroWithPans.length > 0) {
            this.sublineFirstPans = this.sublinesOnAeroWithPans.map((pan) => pan.panoramas[0]);
            // this.panOnSceneCount += this.sublineFirstPans.length;
            // createScene.call(this, this.sublineFirstPans, "sublines");
        }
    }
    renderScene.call(this);
}

function openSublineScene(sid) {
    this.aeroLookPosition = {
        yaw: this.yaw,
        pitch: this.pitch,
    };
    this.countSubPanSteps = 1;
    this.levelPan = 1;
    destroySpots.call(this, this.aeroPanId);
    this.currentSubline = takeObjectFromArray(this.sublinesOnAeroWithPans, sid, "id");
    loadSublineController.call(this, this.currentSubline.panoramas[0].id, (centerYaw) => {
        changeLook({ yaw: centerYaw, pitch: 0 }, this.currentSubScene.scene);
    });
}

function loadSublineController(subPanId, callbackFn) {
    this.subPanId = subPanId;
    const curSubScene = takeObjectFromArray(this.currentSubline.panoramas, subPanId, "id");
    this.subPanIndex = findIndexById(this.currentSubline.panoramas, subPanId);
    this.sublineArrowStepPans = [];
    let changeViewValue = 0;
    if (this.currentSubline.panoramas.length > 1) {
        getSiblingPans(this.currentSubline.panoramas, this.subPanIndex).forEach((el) => {
            const yaw = toRad(bearing(curSubScene, el));
            const baseAngle = yaw + toRad(this.currentSubline.panoramas[this.subPanIndex].magneticAngle);
            this.sublineArrowStepPans.push(Object.assign(el, { yaw: baseAngle, pitch: 0 }))
        });
    }
    if (this.currentSubline.gps) {
        changeViewValue = toRad(bearing(curSubScene, this.currentSubline))
    } else {
        changeViewValue = this.sublineArrowStepPans.reduce((acc, cur) => acc + cur.yaw, 0) / 2;
    }
    let allEnableSublinePans = [curSubScene];
    if (this.sublineArrowStepPans.length > 0) {
        allEnableSublinePans = [ ...allEnableSublinePans, ...this.sublineArrowStepPans];
    }
    const pansForLoad = allEnableSublinePans.filter((pan) => pan && !cacheCheck(pan.id, "sublines"));
    createScene.call(this, pansForLoad, "sublines", () => {
        this.currentSubScene = cache.sublines.find((pan) => pan.id === this.subPanId);
        renderScene.call(this, "sublines", () => {
            if (callbackFn && typeof callbackFn === "function") {
                callbackFn(changeViewValue);
            }
            const opts = {
                panMode: this.levelPan,
                subPanOnScenes: this.sublineArrowStepPans,
                subPanIndex:  this.subPanIndex,
                sublineinfo: {
                    aeroId: this.aeroPanId,
                    subline: takeObjectFromArray(this.currentAeroScene.spots.sublinePolygons, this.currentSubline.id, "id", ["id", "title"])},
            };
            eventFlip.emit("viewMode", {...opts});
        });
    });
}

function createScene(panoramas, type, callbackFn) {
    for (let pan of panoramas) {
        try {
            const result = {
                   id: pan.id,
                scene: this.viewer.createScene({
                    view: this.view,
                    geometry: this.geometry,
                    pinFirstLevel: true,
                    source: M.ImageUrlSource.fromString(pan.src.src),
                }),
            };
            if (type === "aeropanoramas") {
                Object.assign(result,{ spots: prepareJSONMeta(pan.meta) });
            }
            if (this.onLoadedStartpan && this.loadedAssets === 0) {
                this.viewer.stage().loadImage(pan.src.src, null, () => {
                    this.loadedAssets += 1;
                    if (this.loadedAssets === this.panOnSceneCount) {
                        onLoadPanHandler.call(this);
                    }
                });
            }
            cache[type] = !cacheCheck(result.id, type) ? [...cache[type], result] : [...cache[type]];
        } catch (e) {
            console.error(e);
        }
    }
    if (callbackFn && typeof callbackFn === "function") {
        callbackFn.call(this, cache[type]);
    }
}

Aero.prototype.onLoaded = function(userFn) {
    this.onLoadedStartpan = userFn;
};

function onLoadPanHandler() {
    this.onLoadedStartpan(this.loadedAssets);
}

Aero.prototype.switchAeroScene = function(id) {
    if (this.onChangeScene && typeof this.onChangeScene === "function") {
        this.onChangeScene(id);
    } else {
        this.changeAeroScene(id);
    }
};

Aero.prototype.changeAeroScene = function(id) {
    destroySpots.call(this, this.aeroPanId);
    this.aeroPanId = Number(id);
    this.aeroPanIndex = findIndexById(this.panoramasList, Number(id)) || 0;
    loadAeroController.call(this);
};

Aero.prototype.switchSublineScene = function(subPanId) {
    this.countSubPanSteps += 1;
    loadSublineController.call(this, subPanId, (centerYaw) => {
        changeLook({ yaw: centerYaw, pitch: 0 }, this.currentSubScene.scene);
    });
};

Aero.prototype.closeSublineMode = function() {
    destroySublineProperties.call(this);
    renderScene.call(this, "aeropanoramas");
    changeLook(this.aeroLookPosition, this.currentAeroScene.scene);
};

function renderScene(type = "aeropanoramas", callbackFn) {
    if (type === "aeropanoramas") {
        this.currentAeroScene.scene.switchTo({
            transitionDuration: 400,
            transitionUpdate: opacity(transitionStyle().easeOutQuad),
        }, () => {
            createSteps.call(this, this.currentAeroScene, "aeropanoramas", this.switchAeroScene);
            createSteps.call(this, this.currentAeroScene, "sublinePolygons", (id) => openSublineScene.call(this, id), this.sublinesOnAeroWithPans);
            // createSteps.call(this, this.currentAeroScene, "sublines", (id) => openSublineScene.call(this, id), this.sublinesOnAeroWithPans);
            if (callbackFn && typeof callbackFn === "function") {
                callbackFn.call(this);
            }
        });
    } else {
        this.currentSubScene.scene.switchTo({
            transitionDuration: 400,
            transitionUpdate: opacity(transitionStyle().easeOutQuad),
        }, () => {
            if (callbackFn && typeof callbackFn === "function") {
                callbackFn.call(this);
            }
        });
    }
}

function destroySublineProperties() {
    this.countSubPanSteps = 0;
    this.sublineArrowStepPans = [];
    this.currentSubline = {};
    this.subPanIndex = 0;
    this.levelPan = 0;
    const opts = {
        panMode: this.levelPan,
        subPanOnScenes: this.sublineArrowStepPans,
        subPanIndex:  this.subPanIndex,
    };
    eventFlip.emit("viewMode", {...opts});
}

function cacheCheck(id, type) {
    const result = cache[type].find((scene) => scene.id === id);
    return result || false;
}

function setYaw(view) {
    this.yaw = view.yaw();
    this.pitch = view.pitch();
    const coords = {
        yaw: this.yaw,
        pitch: this.pitch,
    };
    eventFlip.emit("rotation", coords);
}

function destroySpots(id) {
    const prevScene = takeObjectFromArray(cache.aeropanoramas, id, "id");
    if (prevScene) {
        const spotList = prevScene.scene.hotspotContainer().listHotspots();
        spotList.forEach((spot) => {
            prevScene.scene.hotspotContainer().destroyHotspot(spot);
        })
    }
}

Aero.prototype.destroy = function() {
    this.view.removeEventListener("change", setYaw.bind(this, this.view));
    this.viewer.destroy();
    clearOwnProperties(this);
    cache = {
        aeropanoramas: [],
        sublines: [],
    };
};

export { Aero, eventFlip };
