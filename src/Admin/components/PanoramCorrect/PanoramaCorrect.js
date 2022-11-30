import React from "react";
import * as PropTypes from "prop-types";
import M from "marzipano";
import classNames from "classnames";
import axios from "../../common/Axios";
import {
    bearing, toRad, sortPans, toDeg, toRoundNum, convertRotate,
} from "./helpers";
import SeparateControl from "./SeparateControl";
import "./style.css";
import imgIcon from "../../../Desktop/assets/icons/imageIcon2.svg";
import videoIcon from "../../../Desktop/assets/icons/videoIcon2.svg";
import { transitionStyle, opacity } from "./settings";
import { getData } from "../../../ContentProvider/fetch";
import CorrecContentBox from "../../views/Lines/Panorama/PanoramContentBox";

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

function setAngle(itemAngle, baseAngle) {
    const sumAngle = (itemAngle + baseAngle) % 360;
    return sumAngle > 180 ? -Math.PI + toRad(sumAngle) - Math.PI : toRad(sumAngle);
}

function changeViewToEditContent(yaw, scene, cbOne, cbTwo) {
    scene.lookTo(
        { yaw, pitch: 0 }, { transitionDuration: 400 },
        () => {
            if (cbOne && cbTwo) {
                cbOne;
                cbTwo;
            }
        },
    );
}

class PanoramaCorrect extends React.Component {
    static propTypes = {
        setPanProp: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            viewer: null,
            panoramas: [],
            images: [],
            videos: [],
            index: 0,
            srcAvailable: false,
            loading: false,
            modalContent: [],
            viewerWidth: null,
            count: 0,
        };
    }

    node = React.createRef();

    cache = [];

    cancel = [];

    componentDidMount() {
        const viewer = new M.Viewer(this.node.current);
        this.setViewer(viewer);
        view.addEventListener("change", this.handleYaw);
    };

    componentDidUpdate(prevProps) {
        if (prevProps.panoramEditMode !== this.props.panoramEditMode && !this.props.panoramEditMode) {
            this.initialPanorams();
        }
        if (prevProps.panoramEditMode !== this.props.panoramEditMode && this.props.panoramEditMode) {
            this.props.setPanProp("startEdit", view.yaw());
        }
        if (prevProps.dateFrom !== this.props.dateFrom) {
            this.initialPanorams();
        }
        if (prevProps.id !== this.props.id) {
            this.setScenes();
        }
        if (prevProps.dateFrom !== this.props.dateFrom) {
            this.initialPanorams();
        }
        if (prevProps.id !== this.props.id) {
            this.setScenes();
        }
    }

    setViewer = (viewer) => {
        this.setState({
            viewer,
            viewerWidth: viewer._size.width,
        }, this.initialPanorams);
    };

    handleYaw = () => {
        this.setState({ yaw: view.yaw() });
    };

    componentWillUnmount() {
        view.removeEventListener("change", this.handleYaw);
        document.removeEventListener("keypress", this.changeSceneRFomKeys);
        this.state.viewer.destroy();
    }

    initialPanorams = (index = 0) => {
        const { params: { id, projectId }, dateFrom } = this.props;
        const url = `/admin/api/projects/${projectId}/lines/${id}/content/panorama`;
        const params = { dateFrom };
        this.fetchPanoram(url, params).then((data) => {
            if (data.payload) {
                const { payload } = data;
                this.setState(
                    {
                        loading: true,
                        srcAvailable: false,
                        modalContent: [],
                        panoramas: [],
                        images: [],
                        videos: [],
                        index,
                    },
                    () => {
                        const pans = payload.sort(sortPans);
                        const checkID = pans.find((pan) => pan.id === this.props.id);
                        const id = checkID ? this.props.id : pans[0].id;
                        this.removeSpots(id, () => {
                            this.props.changePanId(id);
                            this.setState({
                                panoramas: pans,
                                loading: false,
                                srcAvailable: true,
                            }, this.setScenes);
                        })
                    },
                );
            }
        });
    };

    removeSpots = (id, callback) => {
        const pan = this.cache.find((pan) => pan.id === id);
        if (pan) {
            const spotList = pan.scene.hotspotContainer().listHotspots();
            spotList.forEach((spot) => {
                pan.scene.hotspotContainer().destroyHotspot(spot);
            });
        }
        callback();
    };

    setScenes = () => {
        const cachedID = this.cache.map(({ id }) => id);
        const curPan = this.state.panoramas.find(({ id }) => id === this.props.id);
        if (!cachedID.includes(curPan.id)) {
            this.cache.push({
                id: curPan.id,
                scene: this.state.viewer.createScene({
                    source: M.ImageUrlSource.fromString(curPan.src.src),
                    geometry,
                    view,
                    pinFirstLevel: true,
                }),
            });
        }
        const index = this.state.panoramas.findIndex((pan) => pan.id === this.props.id);
        this.getContent().then((result) => {
            this.setState({ ...result, index }, this.sceneOn);
        });
    };

    async fetchPanoram(url, params) {
        try {
            const [promise, cancel] = getData({ url, params }, true);
            this.cancel.push(cancel);
            return promise;
        } catch (e) {
            console.warn("Wrong request in LeafLet Component...", e);
            return [];
        }
    }

    async getContent() {
        const { params: { id, projectId }, dateFrom } = this.props;
        const urls = [
            `/admin/api/projects/${projectId}/lines/${id}/content/image`,
            `/admin/api/projects/${projectId}/lines/${id}/content/video`,
        ];
        const body = { dateFrom };
        try {
            const [{ payload: images }, { payload: videos }] = await Promise.all([
                axios("get", urls[0], body),
                axios("get", urls[1], body),
            ]);
            return { images, videos };
        } catch (e) {
            console.warn("Wrong request in LeafLet Component...", e);
            return [];
        }
    }

    sceneOn = (i = this.state.index) => {
        const { scene } = this.cache.find((item) => item.id === this.props.id);
        scene.switchTo({
            transitionDuration: 400,
            transitionUpdate: opacity(transitionStyle().easeOutQuad),
        }, () => {
            this.removeSpots(this.props.id, () => {
                this.createSteps(scene, i);
                this.createsSpot(scene);
            });
        });
    };

    formPans = (index) => {
        const { panoramas } = this.state;
        const result = [];
        this.props.setPanProp("baseAngel", panoramas[index].magneticAngle || 0);
        this.props.setPanProp("currentPanoramEdit", panoramas[index]);
        for (let i = 0; panoramas.length > i; i += 1) {
            if (index === 0 && i === 1) {
                result.push(panoramas[i]);
            } else if (index > 0 && i !== panoramas.length) {
                if (i === index - 1 || i === index + 1) {
                    result.push(panoramas[i]);
                }
            } else if (index === panoramas.length) {
                if (i === index - 1) {
                    result.push(panoramas[i]);
                }
            }
        }
        return result;
    }

    createSteps = (scene, i) => {
        const { panoramas, index } = this.state;
        const curPan = panoramas[index];
        this.formPans(index).forEach((pan) => {
            const yaw = toRad(bearing(curPan, pan));
            const spot = document.createElement("div");
            const panIndex = panoramas.findIndex((pano) => pano.id === pan.id);
            if (panIndex < index) {
                spot.classList.add("stepper__spot", "stepper__prve");
            } else {
                spot.classList.add("stepper__spot", "stepper__next");
            }
            spot.innerHTML = panIndex + 1;
            const baseAngel = yaw + toRad(curPan.magneticAngle);
            const position = { yaw: baseAngel, pitch: 0 };
            spot.addEventListener("click", () => {
                const lookAngle = toDeg(baseAngel) % 360;
                const resultAngle = lookAngle > 180 ? -Math.PI + toRad(lookAngle) - Math.PI : toRad(lookAngle);
                changeViewToEditContent(
                    resultAngle,
                    scene,
                );
            });
            scene.hotspotContainer().createHotspot(spot, position);
        });
    };

    createsSpot = (scene) => {
        const {
            images, panoramas, index, videos,
        } = this.state;
        const currentPan = panoramas[index].gps;
        const currentPanId = panoramas[index];
        const content = [].concat(images).concat(videos);
        content.forEach((item, i) => {
            if (!Object.is(item.gps, null)) {
                if (currentPan && currentPanId.pointId &&
                    Object.values(currentPan).includes(item.gps.lat) &&
                    Object.values(currentPan).includes(item.gps.long)) {
                    this.renderThumbsPointId(scene, item, i);
                } else if (currentPan &&
                    Object.values(currentPan).includes(item.gps.lat) &&
                    Object.values(currentPan).includes(item.gps.long)) {
                    this.renderThumbs(scene, item, images, i);
                }
                return null;
            }
            return null;
        });
    }

    renderThumbsPointId = (scene, item, i) => {
        const yaw = setAngle(item.magneticAngle || 20, this.props.baseAngel);
        const infoBlock = document.createElement("div");
        const imgHotspot = document.createElement("img");
        imgHotspot.src = item.type === "IMAGE" ? imgIcon : videoIcon;
        infoBlock.classList.add("preview__container");
        imgHotspot.classList.add("preview");
        infoBlock.appendChild(imgHotspot);
        const result = {
            item,
            index: i,
            yaw,
        };
        this.setState((state) => ({
            modalContent: state.modalContent.concat(result),
            count: state.count + 1,
        }));
        imgHotspot.addEventListener("click", () => {
            if (this.props.panoramEditMode) {
                return null;
            }
            if (this.props.currentContentEdit) {
                this.props.setCurrentContentEdit(null);
            }
            infoBlock.classList.add("preview__container-edit");
            changeViewToEditContent(
                yaw,
                scene,
                this.props.setPanProp("contentAngle", item.magneticAngle),
                this.props.setCurrentContentEdit(item),
            );
        });
        scene
            .hotspotContainer()
            .createHotspot(infoBlock, { yaw, pitch: 0.05 });
    };

    renderThumbs = (scene, item, images, i) => {
        const yaw = setAngle(item.magneticAngle || i * 2, this.props.baseAngel);
        const infoBlock = document.createElement("div");
        const imgHotspot = document.createElement("img");
        imgHotspot.src = i < images.length ? imgIcon : videoIcon;
        infoBlock.classList.add("preview__container");
        imgHotspot.classList.add("preview");
        infoBlock.appendChild(imgHotspot);
        const result = {
            item,
            index: i,
            yaw,
        };
        this.setState((state) => ({
            modalContent: state.modalContent.concat(result),
            count: state.count + 1,
        }));
        imgHotspot.addEventListener("click", () => {
            if (this.props.panoramEditMode) {
                return null;
            }
            if (this.props.currentContentEdit) {
                this.props.setCurrentContentEdit(null);
            }
            infoBlock.classList.add("preview__container-edit");
            changeViewToEditContent(
                yaw,
                scene,
                this.props.setPanProp("contentAngle", item.magneticAngle),
                this.props.setCurrentContentEdit(item),
            );
        });
        scene
            .hotspotContainer()
            .createHotspot(infoBlock, { yaw, pitch: 0.05 });
    };

    render() {
        const {
            srcAvailable,
            yaw,
        } = this.state;
        const { panoramEditMode, baseAngel , currentContentEdit} = this.props;
        const baseCoords = view.coordinatesToScreen({ yaw: toRad(baseAngel), pitch: 0 });
        const baseShiftX = baseCoords ? toRoundNum(baseCoords.x / view._width * 100) : -2;
        let editBG = "yellow";
        if (baseAngel - convertRotate(toDeg(yaw)) >= -0.5 && baseAngel - convertRotate(toDeg(yaw)) <= 0.5) {
            editBG = "lime";
        }
        return (
            <React.Fragment>
                <div
                    className="marz-container_correct">
                    <CorrecContentBox currentContentEdit={currentContentEdit} />
                    <span
                        className="correct-pan_separate__base-pos"
                        style={{ left: `${baseShiftX}%` }}>
                        <span className="correct-pan_separate__base__description">
                            Базовый угол
                            {
                                ` ${baseAngel}°`
                            }
                        </span>
                    </span>
                    <span
                        className={`correct-pan_separate__cur-pos ${editBG === "lime" && "start-edit"}`}
                        style={{ left: "50%", borderColor: editBG }} />
                    {
                        panoramEditMode && (
                            <SeparateControl
                                view={view}
                                {...this.props}
                                {...this.state} />
                        )
                    }
                    <div
                        className="marz-container_wrapper-panorams">
                        <div
                            ref={this.node}
                            className={classNames("panos",
                                {
                                    show__pan: srcAvailable,
                                    hide__pan: !srcAvailable,
                                })} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
export default PanoramaCorrect;
