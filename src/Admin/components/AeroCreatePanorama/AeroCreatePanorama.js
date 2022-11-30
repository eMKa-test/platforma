import React from "react";
import * as PropTypes from "prop-types";
import M from "marzipano";
import { postData } from "api";
import { getData } from "ContentProvider/fetch";
import {
    renderAeroSpot, renderSpot, ruleOfAddMeta, sortPans, toRad,
    renderAerosSpot, ruleOfChangeMeta, renderAeroPolygonSpot, prepareJSONMeta,
} from "./helper";
import { opacity, transitionStyle } from "../../../Panorama/settings";
import PanList from "./PanList";
import SublineList from "./SublineList";
import PolygonRender from "./PolygonRender";
import "./style.css";

const panorams = {
    limiter: () => M.RectilinearView.limit.traditional(
        1024 * 3,
        toRad(100),
    ),
    inititalView: {
        yaw: 0,
        pitch: 0,
        fov: 100 * Math.PI / 180,
    },
};

const geometry = new M.EquirectGeometry([{ width: "512px" }]);
const view = new M.RectilinearView(panorams.inititalView, panorams.limiter());

const NoPans = () => (
    <div className="aeropanorama_nocontent">
        Панорам нет
    </div>
);

class AeroCreatePanorama extends React.Component {
    static propTypes = {
        aeroPansCount: PropTypes.number.isRequired,
        lineID: PropTypes.string.isRequired,
        uploadUrl: PropTypes.string.isRequired,
        dateFrom: PropTypes.string,
        setCurrentAeropanForEdit: PropTypes.func.isRequired,
        currentAeropanForEdit: PropTypes.object,
        accessSublines: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            panoramas: [],
            viewer: null,
            index: 0,
            enablePanoramas: false,
            sublinesList: [],
            scenes: [],
            yaw: 0,
            pitch: 0,
            moveDir: "",
            currentScene: null,
            loadedScenes: [],
            mouseCoord: null,
            ctrlPushed: false,
            showSublineList: false,
            showPanList: false,
            addZonePolygon: false,
            editPolygon: null,
        };
        this.getSublinesList = this.getSublinesList.bind(this);
        this.changeAeroSceneData = this.changeAeroSceneData.bind(this);
    }

    panoDom = React.createRef();

    cancel = [];

    componentDidMount() {
        this.launchAeroPanoramas();
    }

    launchAeroPanoramas = () => {
        const { uploadUrl, dateFrom } = this.props;
        if (dateFrom) {
            this.fetchData(uploadUrl, { dateFrom }).then((res) => {
                if (res && res.payload && res.payload.length > 0) {
                    document.addEventListener("keydown", this.startKeyListen);
                    this.setState({
                        viewer: new M.Viewer(this.panoDom.current),
                        panoramas: res.payload.sort(sortPans),
                        enablePanoramas: true,
                    }, this.initialPanorams);
                } else {
                    this.setState({
                        panoramas: [],
                        enablePanoramas: false,
                    });
                }
            });
        }
    };

    async fetchData(url, params) {
        try {
            const [promise, cancel] = await getData({ url, params }, true);
            this.cancel.push(cancel);
            return promise;
        } catch (e) {
            console.warn("Wrong request in LeafLet Component...", e);
            return [];
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { accessSublines, currentAeropanForEdit } = this.props;
        const { currentScene } = this.state;
        const prevSubs = prevProps.accessSublines;
        if (prevProps.dateFrom !== this.props.dateFrom) {
            this.launchAeroPanoramas();
        }
        if (prevSubs.length !== accessSublines.length) {
            this.launchAeroPanoramas();
        }
        if (prevProps.aeroPansCount !== this.props.aeroPansCount && this.props.aeroPansCount > 0 && this.state.scenes.length > 0) {
            this.launchAeroPanoramas();
        }
        if (prevProps.aeroPansCount !== this.props.aeroPansCount && this.props.aeroPansCount === 0 && this.state.scenes.length > 0) {
            this.cleanPan();
        }
        if (currentAeropanForEdit && currentScene && currentAeropanForEdit.id !== currentScene.id) {
            this.switchAeroSceneFromSpot(currentAeropanForEdit.id);
        }
        if (prevState.index !== this.state.index && this.state.scenes.length > 0) {
            this.removePrevSceneSpots(prevState.index);
        }
    }

    componentWillUnmount() {
        if (this.cancel.length > 0) {
            this.cancel.forEach((cancel) => {
                if (cancel && typeof cancel === "function") {
                    cancel();
                }
            });
        }
        this.cleanPan();
    }

    initialPanorams = () => {
        this.setState(
            {
                scenes: [],
                pansOnSlide: [],
                moveDir: "",
                loadedScenes: [],
                index: this.state.index || 0,
            }, this.createScenes,
        );
    };

    createScenes = () => {
        const { panoramas } = this.state;
        const loadedScenes = [];
        const scenes = panoramas.map((pan, i) => {
            loadedScenes.push(i);
            return this.composeScene(panoramas[i], i);
        });
        this.setState({ scenes, loadedScenes }, () => {
            this.sceneOn();
        });
    };

    composeScene = (pan, index) => ({
        id: pan.id,
        index,
        spots: prepareJSONMeta(pan.meta),
        scene: this.state.viewer.createScene({
            view,
            source: M.ImageUrlSource.fromString(pan.src.src),
            geometry,
            pinFirstLevel: true,
        }),
    });

    startKeyListen = (e) => {
        if (e.key === "Control") {
            document.removeEventListener("keydown", this.startKeyListen);
            document.addEventListener("keyup", this.killKeyListen);
            this.setState({
                ctrlPushed: true,
            });
        }
    };

    killKeyListen = () => {
        document.removeEventListener("keyup", this.killKeyListen);
        this.setState({
            ctrlPushed: false,
        });
        document.addEventListener("keydown", this.startKeyListen);
    };

    cleanPan = () => {
        this.setState({
            enablePanoramas: false,
            panoramas: [],
            scenes: [],
            pansOnSlide: [],
            moveDir: "",
            currentScene: null,
            loadedScenes: [],
            index: 0,
        });
        if (this.state.viewer) {
            this.state.viewer.destroy();
        }
        document.removeEventListener("keydown", this.startKeyListen);
    };

    async getSublinesList() {
        const { lineID } = this.props;
        const url = `/admin/api/lines/${lineID}/sublines`;
        const data = await this.fetchData(url);
        return data.payload.length > 0 ? data.payload : [];
    }

    getMouseCoord = (e) => {
        if (this.state.ctrlPushed && !this.state.mouseCoord) {
            const { sublinesList } = this.state;
            const views = this.state.viewer.view();
            const panoDom = this.panoDom.current.getBoundingClientRect();
            const yaw = e.clientX - panoDom.left - 7;
            const pitch = e.clientY - panoDom.top - 7;
            const mouseCoord = views.screenToCoordinates({
                x: yaw,
                y: pitch,
            });
            this.setState({ mouseCoord }, () => {
                renderSpot(this.removeSelectTypeSpot, this.createSelectSpot, this.injectSpot, sublinesList);
            });
        }
    };

    createSelectSpot = (type) => {
        if (type === "aero") {
            this.removeSelectTypeSpot(true, type);
            this.setState({
                showSublineList: false,
                showPanList: true,
            });
            return null;
        }
        this.setState({
            showSublineList: true,
            showPanList: false,
            addZonePolygon: false,
        }, async () => {
            const data = await this.getSublinesList();
            this.setState({
                sublinesList: data,
            });
        });
    };

    removePrevSceneSpots = (prevIndex) => {
        const prevScene = this.state.scenes.filter((scene) => scene.index === prevIndex)[0].scene;
        const spots = prevScene.hotspotContainer().listHotspots();
        spots.forEach((spot) => {
            prevScene.hotspotContainer().destroyHotspot(spot);
        });
    };

    removeSelectTypeSpot = (flag = false, type = "", withoutDeleteSpot = false) => {
        const { currentScene, mouseCoord } = this.state;
        const spots = currentScene.scene.hotspotContainer().listHotspots();
        if (!withoutDeleteSpot) {
            spots.forEach((spot) => {
                // eslint-disable-next-line no-underscore-dangle
                if (spot._coords && spot._coords.yaw === mouseCoord.yaw) {
                    currentScene.scene.hotspotContainer().destroyHotspot(spot);
                }
            });
        }
        if (flag) {
            renderAeroSpot(this.injectSpot, type);
        }
        this.setState({
            mouseCoord: null,
            showPanList: false,
            showSublineList: false,
        });
    };

    submitSelectedSublineOrPanList = (id, title, type, subMeta, gps) => () => {
        const {
            panoramas,
            mouseCoord,
            index,
        } = this.state;
        let body = { ...panoramas[index] };
        let meta;
        if (body.meta) {
            meta = JSON.parse(body.meta);
        }
        const newMeta = ruleOfAddMeta(meta, id, title, mouseCoord, type, subMeta, gps);
        body = {
            ...body,
            meta: newMeta,
        };
        this.changeAeroSceneData(body, type);
    };

    injectSpot = (dom) => {
        const { mouseCoord, currentScene } = this.state;
        currentScene.scene
            .hotspotContainer()
            .createHotspot(dom, { ...mouseCoord });
    };

    injectSpotAero = (dom, viewParams) => {
        const { currentScene } = this.state;
        if (currentScene && currentScene.scene) {
            currentScene.scene
                .hotspotContainer()
                .createHotspot(dom, { ...viewParams });
        }
    };

    injectSpotPolygon = (dom, { params, transform }) => {
        const { currentScene } = this.state;
        if (currentScene && currentScene.scene) {
            currentScene.scene
                .hotspotContainer()
                .createHotspot(dom,
                    { ...params.coord },
                    {
                        perspective: {
                            radius: params.radius.radius,
                            extraTransforms: transform,
                        },
                    },
                );
        }
    };

    sceneOn = (i = this.state.index) => {
        const currentScene = this.state.scenes.filter((sc) => sc.index === i)[0];
        currentScene.scene.switchTo({
            transitionDuration: 300,
            transitionUpdate: opacity(transitionStyle().easeOutQuad),
        }, () => {
            this.props.setCurrentAeropanForEdit(currentScene);
            this.setState({ currentScene, index: i });
            if (currentScene.spots.aeropanoramas.length > 0) {
                currentScene.spots.aeropanoramas.forEach((fly) => {
                    renderAerosSpot(this.injectSpotAero, "aero", fly, this.switchAeroSceneFromSpot, this.deleteSpot);
                });
            }
            if (currentScene.spots.sublines.length > 0) {
                currentScene.spots.sublines.forEach((sub) => {
                    renderAerosSpot(this.injectSpotAero, "zone", sub, this.switchAeroSceneFromSpot, this.deleteSpot);
                });
            }
            if (currentScene.spots.sublinePolygons.length > 0) {
                currentScene.spots.sublinePolygons.forEach((pol) => {
                    renderAeroPolygonSpot(this.injectSpotPolygon, pol, this.switchAeroSceneFromSpot, this.deleteSpot, this.editPolygon);
                });
            }
        });
    };

    deleteSpot = (id, type) => {
        const answer = confirm(`Точно удалить маркер ID: ${id}`);
        if (!answer) {
            return null;
        }
        const { currentScene, panoramas, index } = this.state;
        const spots = currentScene.scene.hotspotContainer().listHotspots();
        let body = { ...panoramas[index] };
        const meta = JSON.parse(body.meta);
        const sortTypes = {
            aero: "aeropanoramas",
            zone: "sublines",
            polygon: "sublinePolygons",
        };
        const result = currentScene.spots[sortTypes[type]].reduce((acc, cur) => {
            const res = {
                lost: {},
                stay: [],
                ...acc,
            };
            if (cur.id === id) {
                res.lost = cur;
            } else {
                res.stay.push(cur);
            }
            acc = res;
            return acc;
        }, {});
        const newMeta = ruleOfChangeMeta(meta, result.stay, sortTypes[type]);
        spots.forEach((spot) => {
            // eslint-disable-next-line no-underscore-dangle
            if (spot._coords.yaw === result.lost.yaw) {
                currentScene.scene.hotspotContainer().destroyHotspot(spot);
            }
        });
        body = {
            ...body,
            meta: newMeta,
        };
        this.changeAeroSceneData(body, type, true);
    };

    editPolygon = (editPolygon) => this.setState({ editPolygon });

    changeAeroSceneData = (body, type, withoutDeleteSpot) => {
        const { uploadUrl } = this.props;
        const {
            currentScene,
            index,
        } = this.state;
        const mainUrl = `${uploadUrl}aeropanorama/${currentScene.id}`;
        postData({ mainUrl, body })
            .then((res) => {
                if (res.success) {
                    if (type) {
                        this.removeSelectTypeSpot(true, type, withoutDeleteSpot);
                    }
                    this.launchAeroPanoramas(index);
                }
            });
    };

    switchAeroSceneFromSpot = (nextId) => {
        const { scenes } = this.state;
        const nextIndex = scenes.findIndex((fly) => fly.id === nextId);
        this.sceneOn(nextIndex);
    };

    removePolygon = (deletePolygonAfterEdit) => {
        if (deletePolygonAfterEdit) {
            this.deleteSpot(this.state.editPolygon.id, "polygon");
        }
        this.setState({ addZonePolygon: false, editPolygon: null });
    };

    addPolygon = () => this.setState({ addZonePolygon: true });

    render() {
        const {
            index,
            panoramas,
            currentScene,
            addZonePolygon,
            enablePanoramas,
            editPolygon,
        } = this.state;
        return (
            <div style={{ height: "800px", position: "relative" }}>
                <div
                    ref={this.panoDom}
                    onClick={this.getMouseCoord}
                    className="aeropanorama">
                    {
                        ((currentScene && panoramas[index]) || editPolygon) && (
                            <PolygonRender
                                editPolygon={editPolygon}
                                changeAeroSceneData={this.changeAeroSceneData}
                                getSublineList={this.getSublinesList}
                                addZonePolygon={addZonePolygon}
                                addpolygon={this.addPolygon}
                                removePolygon={this.removePolygon}
                                view={view}
                                currentPanorama={panoramas[index]}
                                onScenePolygons={currentScene.spots.sublinePolygons}
                                scene={currentScene.scene} />
                        )
                    }
                    {
                        currentScene && currentScene.spots.sublines && (
                            <SublineList
                                {...this.state}
                                onClose={this.removeSelectTypeSpot}
                                subPanoramas={currentScene.spots.sublines}
                                onSubmit={this.submitSelectedSublineOrPanList} />
                        )
                    }
                    {
                        currentScene && currentScene.spots.aeropanoramas && (
                            <PanList
                                {...this.state}
                                onClose={this.removeSelectTypeSpot}
                                aeropanoramas={currentScene.spots.aeropanoramas}
                                currentPanID={currentScene.id}
                                onSubmit={this.submitSelectedSublineOrPanList} />
                        )
                    }
                    {
                        !enablePanoramas && <NoPans />
                    }
                </div>
            </div>
        );
    }
}

export default AeroCreatePanorama;
