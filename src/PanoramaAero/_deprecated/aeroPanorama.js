import React from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import M from "marzipano";
import axios from "../Desktop/common/axios";
import StepBlock from "./stepBlock";
import {
    bearing,
    toRad,
    toDeg,
    findIndex,
    sortScenes,
    sortPans,
    getSiblingPans,
    renderSteps,
    jsonToObject,
    getSublinesBySublineId,
    checkCountSublinesOnZone,
} from "./helpers";
import { transitionStyle, opacity } from "./settings";
import "./style.css";

const panorams = {
    limiter: () => M.RectilinearView.limit.traditional(
        1024 * 3,
        toRad(100),
    ),
    inititalView: {
        yaw: -1.56,
        pitch: 0,
        // eslint-disable-next-line no-mixed-operators
        fov: (100 * Math.PI) / 180,
    },
};

const geometry = new M.EquirectGeometry([{ width: "512px" }]);
const view = new M.RectilinearView(panorams.inititalView, panorams.limiter());

const changeLook = (yaw, scene) => {
    const lookAngle = toDeg(yaw) % 360;
    const resultAngle = lookAngle > 180 ? -Math.PI + toRad(lookAngle) - Math.PI : toRad(lookAngle);
    scene.lookTo({ yaw: resultAngle, pitch: 0 }, {
        transitionDuration: 800,
    });
};

class PanoramaAero extends React.Component {
    static propTypes = {
        media: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        setSublineMode: PropTypes.func,
        routeParams: PropTypes.objectOf(PropTypes.string),
        date: PropTypes.string,
        history: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            viewer: null,
            index: 0,
            yaw: 0,
            pitch: 0,
            panoramas: [],
            enableSublines: true,
            pansOnSlide: [],
            zonesOnSlide: [],
            subsOnSlide: [],
            scenes: [],
            fromMap: true,
            moveDir: "frwrdStep",
            currentAeroScene: null,
            loadedScenes: [],
            subIndex: 0,
            subScenes: [],
            zoneIndex: null,
            selectZone: "",
            levelPan: 0,
            currentSubScene: null,
            loadedSubScenes: [],
            aeroLookBeforeSub: 0,
            sublineDate: "",
            sublinesOnScene: [],
        };
    }

    panoDom = React.createRef();

    cancel = [];

    componentDidMount() {
        this.launchAeroPanoramas();
        view.addEventListener("change", this.handleSetYaw);
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            ((prevState.index !== this.state.index)
                || (prevState.levelPan !== this.state.levelPan && this.state.levelPan === 1)) &&
            this.state.scenes.length > 0) {
            this.removePrevSceneSpots(prevState.index);
        }
        if (prevProps.date !== this.props.date) {
            this.refreshUrlAtDate();
        }
    }

    componentWillUnmount() {
        this.cancel.forEach((cancel) => {
            cancel("PANS CANCEL");
        });
        view.removeEventListener("change", this.handleSetYaw);
        this.props.setSublineMode(false);
        if (this.state.viewer) {
            this.state.viewer.destroy();
        }
    }

    handleSetYaw = () => {
        this.setState({
            yaw: view.yaw(),
            pitch: view.pitch(),
        });
    };

    refreshUrlAtDate = () => {
        this.setState({
            enableSublines: true,
        }, () => {
            const {
                routeParams: {
                    companySlug, lineID, tab, contentID,
                }, date,
            } = this.props;
            const url = `/${companySlug}/content/${lineID}/${tab}/${date}/${contentID}`;
            this.props.history.replace(url);
            this.sublinesOnScene(this.state.currentAeroScene).then(() => {
                this.createAeroZones(this.state.currentAeroScene);
            }).catch(() => console.log("cancel subscribe sublines on slide"));
        });
    };

    removePrevSceneSpots = (prevIndex) => {
        const prevScene = this.state.scenes.filter((scene) => scene.index === prevIndex)[0].scene;
        const spots = prevScene.hotspotContainer().listHotspots();
        spots.forEach((spot) => {
            prevScene.hotspotContainer().destroyHotspot(spot);
        });
    };

    removeZoneSpotsBeforeRefreshDate = () => {
        const { currentAeroScene, zonesOnSlide } = this.state;
        const zoneYaws = zonesOnSlide.map((sub) => sub.yaw);
        const spots = currentAeroScene.scene.hotspotContainer().listHotspots();
        spots.forEach((spot) => {
            const spotYaw = spot.position().yaw;
            if (zoneYaws.includes(spotYaw)) {
                currentAeroScene.scene.hotspotContainer().destroyHotspot(spot);
            }
        });
    };

    launchAeroPanoramas = () => {
        const { media } = this.props;
        if (!Array.isArray(media)) {
            return null;
        }
        const viewer = new M.Viewer(this.panoDom.current);
        media.sort(sortPans);
        this.setState({
            viewer,
            panoramas: media,
        }, this.initialPanorams);
    };

    initialPanorams = () => {
        const { routeParams = {} } = this.props;
        const { panoramas } = this.state;
        const index = findIndex(panoramas, routeParams.contentID) || 0;
        this.setState(
            {
                fromMap: false,
                scenes: [],
                pansOnSlide: [],
                subsOnSlide: [],
                zonesOnSlide: [],
                currentAeroScene: null,
                loadedScenes: [],
                index,
            },
            () => {
                this.createScenes(index, panoramas, "aero");
            },
        );
    };

    initialSubZoneFromAero = (id) => {
        const zoneIndex = this.state.sublinesOnScene.findIndex((el) => el.id === id);
        if (zoneIndex === -1) {
            return null;
        }
        if (this.props.setSublineMode) {
            this.props.setSublineMode(true);
        }
        this.setState((state) => ({
            enableSublines: false,
            selectZone: id,
            zoneIndex,
            levelPan: 1,
            aeroLookBeforeSub: state.yaw,
        }), () => this.createScenes(0, this.state.sublinesOnScene[zoneIndex].panoramas, "", null));
        return null;
    };

    createScenes = (currentIndex = 0, allScenes = [], type = "") => {
        const scenes = [];
        for (let i = 0; i < allScenes.length; i += 1) {
            if (currentIndex === 0) {
                if (i === currentIndex || i === currentIndex + 1) {
                    scenes.push(this.composeScene(allScenes[i], i));
                }
            } else if (currentIndex === allScenes.length - 1) {
                if (i >= allScenes.length - 2) {
                    scenes.push(this.composeScene(allScenes[i], i));
                }
            } else if (i >= currentIndex - 1 && i <= currentIndex + 1) {
                scenes.push(this.composeScene(allScenes[i], i));
            }
        }
        const loadedScenes = scenes.map((scene) => scene.index);
        if (type === "aero") {
            this.setState({
                scenes,
                loadedScenes,
            }, this.getIndexFromContentIDAndSwitchAeroScene);
        } else {
            this.setState({
                subScenes: scenes,
                loadedSubScenes: loadedScenes,
            }, this.subSceneOn);
        }
    };

    composeScene = (pan, index) => ({
        id: pan.id,
        index,
        sublines: pan.meta && jsonToObject(pan.meta, "sublines"),
        aeropanoramas: pan.meta && jsonToObject(pan.meta, "aeropanoramas"),
        scene: this.state.viewer.createScene({
            view,
            source: M.ImageUrlSource.fromString(pan.src.raw || pan.src.src),
            geometry,
            pinFirstLevel: true,
        }),
    });

    getIndexFromContentIDAndSwitchAeroScene = (contentID = this.state.panoramas[0].id) => {
        let panMatch = this.state.scenes.findIndex((pan) => Number(contentID) === pan.id);
        if (this.state.index > 0) {
            panMatch = this.state.index;
        }
        if (panMatch >= 0) {
            this.setState({
                index: panMatch,
                pansOnSlide: [],
                subsOnSlide: [],
                zonesOnSlide: [],
            }, this.switchAeroScene);
        } else {
            this.setState({
                fromMap: true,
            });
        }
    };

    switchAeroScene = (i = this.state.index) => {
        const {
            history,
            date,
            routeParams: {
                companySlug,
                lineID,
            },
        } = this.props;
        const currentAeroScene = this.state.scenes.filter((sc) => sc.index === this.state.index)[0];
        if (history) {
            const url = `/${companySlug}/content/${lineID}/aeropanorama/${date}/${currentAeroScene.id}`;
            this.props.setContentId(url);
        }
        currentAeroScene.scene.switchTo({
            transitionDuration: 400,
            transitionUpdate: opacity(transitionStyle().easeOutQuad),
        }, () => {
            this.setState({ fromMap: true, currentAeroScene });
            this.createAeroSteps(currentAeroScene);
            if (currentAeroScene.sublines && currentAeroScene.sublines.length > 0) {
                this.sublinesOnScene(currentAeroScene).then(() => {
                    this.createAeroZones(currentAeroScene);
                }).catch(() => console.log("cancel subscribe sublines on slide"));
            } else {
                this.createAeroZones(currentAeroScene);
            }
        });
    };

    sublinesOnScene = async (currentAeroScene) => {
        const sublinesIdOnScene = currentAeroScene.sublines.map((sub) => sub.id);
        const panoramas = await this.getPanoramaContent();
        if (panoramas && panoramas.payload.length > 0) {
            const sublinesOnScene = getSublinesBySublineId(panoramas.payload, sublinesIdOnScene);
            this.setState({ sublinesOnScene, enableSublines: false }, this.removeZoneSpotsBeforeRefreshDate);
        }
    };

    getPanoramaContent = () => {
        const { routeParams: { lineID }, date } = this.props;
        const url = `/user/api/lines/${lineID}/content/panorama?dateFrom=${date}`;
        const [cancel, promise] = axios("get", url, null, true);
        this.cancel.push(cancel);
        return promise;
    };

    subSceneOn = (i = this.state.subIndex) => {
        const currentSubScene = this.state.subScenes[i];
        currentSubScene.scene.switchTo({
            transitionDuration: 400,
            transitionUpdate: opacity(transitionStyle().easeOutQuad),
        }, () => {
            this.setState({ fromMap: true, currentSubScene });
            this.createSubSteps(currentSubScene);
        });
    };

    injectSpots = (scene, dom, yaw, pitch) => {
        if (scene) {
            scene.hotspotContainer()
                .createHotspot(dom, { yaw, pitch });
        }
    };

    createAeroSteps = (scene) => {
        if (scene && scene.aeropanoramas && scene.aeropanoramas.length > 0) {
            scene.aeropanoramas.forEach((pan, i) => {
                this.setState((state) => ({
                    pansOnSlide: state.pansOnSlide.concat(Object.assign(
                        pan,
                        {
                            yaw: pan.yaw,
                            pitch: pan.pitch,
                        },
                    )),
                }));
                renderSteps(scene.scene, pan, i, "aero", this.injectSpots, this.switchScene);
            });
        }
    };

    createAeroZones = (scene) => {
        if (scene && scene.sublines && scene.sublines.length > 0) {
            scene.sublines.forEach((pan, i) => {
                this.setState((state) => ({
                    zonesOnSlide: state.zonesOnSlide.concat(Object.assign(
                        pan,
                        { yaw: pan.yaw, pitch: pan.pitch },
                    )),
                }));
                const checkCount = async () => {
                    const result = await checkCountSublinesOnZone(pan.id, this.state.sublinesOnScene);
                    return result;
                };
                checkCount().then((count) => {
                    renderSteps(scene.scene, pan, i, "zone", this.injectSpots, this.initialSubZoneFromAero, count);
                    this.setState({
                        enableSublines: false,
                    });
                }).catch(() => console.log("cancel subscribe aeropan"));
            });
        }
    };

    createSubSteps = () => {
        const subPans = this.state.sublinesOnScene[this.state.zoneIndex].panoramas;
        const curSubPan = subPans[this.state.subIndex];
        getSiblingPans(subPans, this.state.subIndex).forEach((subPan) => {
            const yaw = toRad(bearing(curSubPan, subPan));
            const baseAngle = yaw + toRad(curSubPan.magneticAngle);
            if (this.state.subIndex === 0 && this.state.subScenes.length <= 2) {
                changeLook(baseAngle, this.state.currentSubScene.scene);
            }
            this.setState((state) => ({
                subsOnSlide: state.subsOnSlide.concat(
                    Object.assign(subPan, { yaw: baseAngle, pitch: 0 }),
                ),
            }));
        });
    };

    switchScene = (id, type = "aero") => {
        if (type === "zone") {
            const { loadedSubScenes } = this.state;
            const index = this.state.subIndex;
            const subPans = this.state.sublinesOnScene[this.state.zoneIndex];
            const { panoramas } = subPans;
            const nextIndex = findIndex(panoramas, id);
            const checkNewIndex = loadedSubScenes.findIndex((i) => i === nextIndex);
            if (index < nextIndex) {
                this.setState({
                    moveDir: "frwrdStep",
                }, () => {
                    if (checkNewIndex >= 0 && loadedSubScenes.includes(nextIndex + 1)) {
                        this.nextStepWithoutLoad(nextIndex, type);
                        return null;
                    }
                    this.loadNewScenes(nextIndex, "frwrdStep", type);
                    return null;
                });
            } else {
                this.setState({
                    moveDir: "backStep",
                }, () => {
                    if (checkNewIndex >= 0 && loadedSubScenes.includes(nextIndex - 1)) {
                        this.nextStepWithoutLoad(nextIndex, type);
                        return null;
                    }
                    this.loadNewScenes(nextIndex, "backStep", type);
                    return null;
                });
            }
        } else {
            const {
                index,
                scenes,
                loadedScenes,
                currentAeroScene,
            } = this.state;
            const accessNextFly = currentAeroScene.aeropanoramas.some((fly) => fly.id === id);
            if (!accessNextFly) {
                return null;
            }
            const nextIndex = findIndex(scenes, id);
            const checkNewIndex = loadedScenes.findIndex((i) => i === nextIndex);
            if (index < nextIndex) {
                this.setState({
                    moveDir: "frwrdStep",
                }, () => {
                    if (checkNewIndex >= 0 && loadedScenes.includes(nextIndex + 1)) {
                        this.nextStepWithoutLoad(nextIndex, type);
                        return null;
                    }
                    this.loadNewScenes(nextIndex, "frwrdStep", type);
                    return null;
                });
            } else {
                this.setState({
                    moveDir: "backStep",
                }, () => {
                    if (checkNewIndex >= 0 && loadedScenes.includes(nextIndex - 1)) {
                        this.nextStepWithoutLoad(nextIndex, type);
                        return null;
                    }
                    this.loadNewScenes(nextIndex, "backStep", type);
                    return null;
                });
            }
        }
        return null;
    };

    loadNewScenes = (index, direction, type) => {
        let { scenes } = this.state;
        let { panoramas } = this.state;
        const loadScenes = [];
        let newSceneList = [];
        if (type === "zone") {
            const subPans = this.state.sublinesOnScene[this.state.zoneIndex];
            panoramas = subPans.panoramas;
            scenes = this.state.subScenes;
        }
        for (let i = 0; i < panoramas.length; i += 1) {
            if (direction === "backStep") {
                if (i === index - 1) {
                    loadScenes.push(this.composeScene(panoramas[i], i));
                }
            } else if (i === index + 1) {
                loadScenes.push(this.composeScene(panoramas[i], i));
            }
        }
        newSceneList = scenes.concat(loadScenes);
        newSceneList.sort(sortScenes);
        const newLoadedScenes = newSceneList.map((scene) => scene.index);
        if (type === "aero") {
            this.setState({
                scenes: newSceneList,
                loadedScenes: newLoadedScenes,
                index,
                pansOnSlide: [],
                subsOnSlide: [],
                zonesOnSlide: [],
                fromMap: false,
            }, this.switchAeroScene);
        } else {
            this.setState({
                subScenes: newSceneList,
                loadedSubScenes: newLoadedScenes,
                subIndex: index,
                subsOnSlide: [],
                fromMap: false,
            }, this.subSceneOn);
        }
    };

    nextStepWithoutLoad = (nextIndex, type) => {
        if (type === "aero") {
            this.setState({
                index: nextIndex,
                pansOnSlide: [],
                subsOnSlide: [],
                zonesOnSlide: [],
                fromMap: false,
            }, () => {
                this.switchAeroScene(nextIndex);
            });
        } else {
            this.setState({
                subIndex: nextIndex,
                subsOnSlide: [],
                fromMap: false,
            }, () => {
                this.subSceneOn(nextIndex);
            });
        }
    };

    backToAeroFromSub = () => {
        if (this.props.setSublineMode) {
            this.props.setSublineMode(false);
        }
        this.setState({
            subIndex: 0,
            selectZone: "",
            subsOnSlide: [],
            subScenes: [],
            zoneIndex: null,
            levelPan: 0,
            currentSubScene: null,
            moveDir: "frwrdStep",
        }, this.switchAeroScene);
    };

    render() {
        const {
            levelPan,
            subsOnSlide,
            subIndex,
        } = this.state;
        return (
            <React.Fragment>
                <div
                    className="marz-container_wrapper-panorams">
                    <button
                        type="button"
                        className={classNames(
                            "aero_pan-back",
                            { "aero_pan-back-show": levelPan === 1 },
                        )}
                        onClick={this.backToAeroFromSub}>
                        &#128940;
                    </button>
                    <div
                        ref={this.panoDom}
                        className="aero-panorama">
                        {
                            levelPan === 1 && subsOnSlide.length > 0 && (
                                <StepBlock
                                    yaw={this.state.yaw}
                                    pitch={this.state.pitch}
                                    subPanIndex={subIndex}
                                    nextSubPan={this.switchScene}
                                    subPanOnScenes={subsOnSlide} />
                            )
                        }
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
export default PanoramaAero;
