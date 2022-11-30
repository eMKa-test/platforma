import React from "react";
import * as PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import M from "marzipano";
import {
    bearing,
    toRad,
    toDeg,
    findIndex,
    sortScenes,
} from "./helpers";
import { transitionStyle, opacity } from "./settings";
import Modal from "./modal";
import imgIcon from "../Desktop/assets/icons/imageIcon2.svg";
import videoIcon from "../Desktop/assets/icons/videoIcon2.svg";
import StepBlock from "./stepBlock";
import RadarZone from "./radarZone";
import "./style.css";
import metrikaEvents, { PANORAMA_ENTER } from "../common/Metrika";

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

function setAngle(magneticAngle, count) {
    return toRad(magneticAngle + count);
}

class Panorama extends React.Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        media: PropTypes.array.isRequired,
        setContentId: PropTypes.func.isRequired,
        setPanoramContent: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            viewer: null,
            index: 0,
            srcAvailable: false,
            loading: false,
            openModal: false,
            modalContent: [],
            viewerWidth: null,
            count: 0,
            contentGalleryId: null,
            pansOnSlide: [],
            id: 1,
            scenes: [],
            yaw: 0,
            pitch: 0,
            fromMap: true,
            moveDir: "",
            currentScene: null,
            loadedScenes: [],
        };
    }

    node = React.createRef();

    componentDidMount() {
        const viewer = new M.Viewer(this.node.current);
        view.addEventListener("change", this.handleSetYaw);
        this.setViewer(viewer);
    }

    handleSetYaw = () => {
        this.setState({
            yaw: view.yaw(),
            pitch: view.pitch(),
        });
    };

    componentDidUpdate(prevProps, prevState) {
        const { contentID } = this.props.match.params;
        if (prevProps.match.params.contentID !== contentID && this.state.fromMap) {
            this.showSceneFromMap(Number(contentID));
        }
        if (prevState.index !== this.state.index && this.state.scenes.length > 0) {
            const prevScene = this.state.scenes.filter((scene) => prevState.index === scene.index)[0].scene;
            const spots = prevScene.hotspotContainer().listHotspots();
            spots.forEach((spot) => {
                prevScene.hotspotContainer().destroyHotspot(spot);
            });
        }
    }

    componentWillUnmount() {
        view.removeEventListener("change", this.handleSetYaw);
        if (this.state.view) {
            this.state.viewer.destroy();
        }
    }

    setViewer = (viewer) => {
        this.setState({
            viewer,
            viewerWidth: viewer._size.width,
        }, this.initialPanorams);
    };

    initialPanorams = () => {
        const { match: { params: { contentID } }, media: [{ panoramas }] } = this.props;
        const index = findIndex(panoramas, contentID) || 0;
        this.setState(
            {
                fromMap: false,
                loading: true,
                srcAvailable: false,
                modalContent: [],
                scenes: [],
                pansOnSlide: [],
                moveDir: "",
                currentScene: null,
                loadedScenes: [],
                index,
            },
            () => {
                this.createScenes(index, contentID);
            },
        );
    };

    createScenes = (currentIndex, contentID) => {
        const [{ panoramas }] = this.props.media;
        const scenes = [];
        for (let i = 0; i < panoramas.length; i += 1) {
            if (currentIndex === 0) {
                if (i === currentIndex || i === currentIndex + 1) {
                    scenes.push(this.composeScene(panoramas[i], i));
                }
            } else if (currentIndex === panoramas.length - 1) {
                if (i >= panoramas.length - 2) {
                    scenes.push(this.composeScene(panoramas[i], i));
                }
            } else if (i >= currentIndex - 1 && i <= currentIndex + 1) {
                scenes.push(this.composeScene(panoramas[i], i));
            }
        }
        const loadedScenes = scenes.map((scene) => scene.index);
        this.setState({ scenes, loadedScenes }, () => {
            this.getIndexFromContentID(contentID);
        });
    };

    showSceneFromMap = (contentID) => {
        const { media: [{ panoramas }] } = this.props;
        const { scenes, loadedScenes } = this.state;
        const index = findIndex(panoramas, contentID);
        const loadScenes = [];
        let newSceneList = [];
        for (let i = 0; i < panoramas.length; i += 1) {
            if (index === 0 && (i === index || i === index + 1)) {
                if (!loadedScenes.includes(i)) {
                    loadScenes.push(this.composeScene(panoramas[i], i));
                }
            } else if (index === panoramas.length - 1 && (i === index || i === index - 1)) {
                if (!loadedScenes.includes(i)) {
                    loadScenes.push(this.composeScene(panoramas[i], i));
                }
            } else if (i === index - 1 || i === index || i === index + 1) {
                if (!loadedScenes.includes(i)) {
                    loadScenes.push(this.composeScene(panoramas[i], i));
                }
            }
        }
        newSceneList = scenes.concat(loadScenes).sort(sortScenes);
        const newLoadedScenes = newSceneList.map((scene) => scene.index);
        this.setState({
            scenes: newSceneList,
            loadedScenes: newLoadedScenes,
            index,
            modalContent: [],
            count: 0,
            pansOnSlide: [],
            fromMap: false,
        }, this.sceneOn);
        return null;
    };

    loadNewScenes = (index, direction) => {
        const { media: [{ panoramas }] } = this.props;
        const { scenes } = this.state;
        const loadScenes = [];
        let newSceneList = [];
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
        this.setState({
            scenes: newSceneList,
            loadedScenes: newLoadedScenes,
            index,
            modalContent: [],
            count: 0,
            pansOnSlide: [],
            fromMap: false,
        }, this.sceneOn);
    };

    composeScene = (pan, index) => ({
        id: pan.id,
        index,
        scene: this.state.viewer.createScene({
            view,
            source: M.ImageUrlSource.fromString(pan.src.src),
            geometry,
            pinFirstLevel: true,
        }),
    });

    getIndexFromContentID = (contentID = this.props.media[0].panoramas[0].id) => {
        const { media: [{ panoramas }], match: { params } } = this.props;
        const panMatch = panoramas.findIndex((pan) => Number(contentID) === pan.id);
        if (panMatch >= 0) {
            this.setState({
                index: panMatch,
                modalContent: [],
                pansOnSlide: [],
                count: 0,
            },() => {
                const meta = {
                    company: params.companySlug,
                    lineID: params.lineID,
                    tab: params.tab,
                    panoramID: contentID,
                };
                metrikaEvents.emit(PANORAMA_ENTER, meta, () => this.sceneOn());
            });
        } else if (panoramas[0].id !== contentID) {
            this.setState({
                index: 0,
                modalContent: [],
                pansOnSlide: [],
                count: 0,
            }, () => {
                const meta = {
                    company: params.companySlug,
                    lineID: params.lineID,
                    tab: params.tab,
                    panoramID: contentID,
                };
                metrikaEvents.emit(PANORAMA_ENTER, meta, () => this.sceneOn());
            });
        } else {
            this.setState({
                srcAvailable: false,
                fromMap: true,
            });
        }
    };

    sceneOn = (i = this.state.index) => {
        const {
            media: [{
                media,
            }],
        } = this.props;
        const currentScene = this.state.scenes.filter((sc) => sc.index === i)[0];
        currentScene.scene.switchTo({
            transitionDuration: 400,
            transitionUpdate: opacity(transitionStyle().easeOutQuad),
        }, () => {
            this.setState({ fromMap: true, currentScene });
            this.createSteps();
            if (media.length > 0) {
                this.createsSpot(currentScene.scene);
            }
        });
    };

    formPans = (index) => {
        const { media: [{ panoramas }] } = this.props;
        const result = [];
        for (let i = 0; panoramas.length > i; i += 1) {
            if (index === 0 && i === 1) {
                result.push(panoramas[i]);
            } else if (index > 0 && i !== panoramas.length) {
                if (i === index - 1 || i === index + 1) {
                    result.push(panoramas[i]);
                }
            }
            if (index === panoramas.length) {
                if (i === index - 1) {
                    result.push(panoramas[i]);
                }
            }
        }
        return result;
    };

    createSteps = () => {
        const { index } = this.state;
        const { media: [{ panoramas }] } = this.props;
        const curPan = panoramas[index];
        this.formPans(this.state.index).forEach((pan) => {
            const yaw = toRad(bearing(curPan, pan));
            const baseAngle = yaw + toRad(curPan.magneticAngle);
            this.setState((state) => ({
                srcAvailable: true,
                pansOnSlide: state.pansOnSlide.concat(Object.assign(pan, { yaw: baseAngle })),
            }));
        });
    };

    createsSpot = (scene) => {
        const { media: [{ panoramas, media }] } = this.props;
        const { index } = this.state;
        const currentPan = panoramas[index].gps;
        media.forEach((item, i) => {
            if (!Object.is(item.gps, null)) {
                if (currentPan &&
                    Object.values(currentPan).includes(item.gps.lat) &&
                    Object.values(currentPan).includes(item.gps.long)) {
                    this.renderThumbs(scene, item, i);
                }
                return null;
            }
            return null;
        });
    };

    renderThumbs = (scene, item, i) => {
        const yaw = setAngle(item.magneticAngle || i, 0);
        const infoBlock = document.createElement("div");
        const thumbContainer = document.createElement("div");
        const imgHotspot = document.createElement("img");
        const thumbPreview = document.createElement("img");
        imgHotspot.src = item.type === "IMAGE" ? imgIcon : videoIcon;
        infoBlock.classList.add("preview__container");
        imgHotspot.classList.add("preview");
        thumbContainer.classList.add("wrapper-panorama-thumb", "hide-panorama-thumb");
        thumbPreview.classList.add("thumb-panorama-preview");
        thumbPreview.src = item.src.tmb;
        infoBlock.appendChild(imgHotspot);
        thumbContainer.appendChild(thumbPreview);
        infoBlock.appendChild(thumbContainer);
        const result = {
            item,
            index: i,
            yaw,
        };
        this.setState((state) => ({
            modalContent: state.modalContent.concat(result),
            count: state.count + 1,
        }), () => {
            infoBlock.addEventListener("click", () => {
                this.setState((state) => ({
                    openModal: !state.openModal,
                    contentGalleryId: item.id,
                }));
            });
            infoBlock.addEventListener("mouseenter", () => {
                thumbContainer.classList.add("show-panorama-thumb");
                thumbContainer.classList.remove("hide-panorama-thumb");
            });
            infoBlock.addEventListener("mouseleave", () => {
                thumbContainer.classList.add("hide-panorama-thumb");
                thumbContainer.classList.remove("show-panorama-thumb");
            });
            scene
                .hotspotContainer()
                .createHotspot(infoBlock, { yaw, pitch: 0.05 });
        });
    };

    findPan = (id) => {
        const { media: [{ panoramas }], setPanoramContent } = this.props;
        setPanoramContent(id);
        const { index, loadedScenes } = this.state;
        const nextIndex = findIndex(panoramas, id);
        const checkNewIndex = loadedScenes.findIndex((i) => i === nextIndex);
        if (index < nextIndex) {
            this.setState({
                moveDir: "frwrdStep",
            }, () => {
                if (checkNewIndex >= 0 && loadedScenes.includes(nextIndex + 1)) {
                    this.nextStepWithoutLoad(nextIndex);
                    return null;
                }
                this.loadNewScenes(nextIndex, "frwrdStep");
            });
        } else {
            this.setState({
                moveDir: "backStep",
            }, () => {
                if (checkNewIndex >= 0 && loadedScenes.includes(nextIndex - 1)) {
                    this.nextStepWithoutLoad(nextIndex);
                    return null;
                }
                this.loadNewScenes(nextIndex, "backStep");
            });
        }
    };

    nextStepWithoutLoad = (nextIndex) => (
        this.setState({
            index: nextIndex, modalContent: [], count: 0, pansOnSlide: [], fromMap: false,
        }, () => {
            this.sceneOn(nextIndex);
        })
    );

    setNorthPosition = (shift) => {
        if (shift) {
            const newPosition = toDeg(shift);
            return `${-newPosition - 45}`;
        }
        return -45;
    };

    setOpenModal = () => this.setState((state) => ({ openModal: !state.openModal }));

    openModalFromRadar = (item) => {
        this.setState((state) => ({
            openModal: !state.openModal,
            contentGalleryId: item.id,
        }));
    };

    modalShowContent = (contentGalleryId, openModal, content) => (
        <Modal
            tabInfo={this.props.match.params}
            index={contentGalleryId}
            fullScreenContent={this.setOpenModal}
            content={content}
            isOpen={openModal} />
    );

    render() {
        const {
            scenes,
            openModal,
            modalContent,
            currentScene,
            srcAvailable,
            contentGalleryId,
        } = this.state;
        return (
            <div
                className="marz-container_wrapper-panorams">
                <div
                    ref={this.node}
                    className="panos">
                    {
                        scenes.length > 0 && (
                            <StepBlock
                                {...this.state}
                                stepNextPan={this.findPan}
                                openModalFromRadar={this.openModalFromRadar}
                                setNorthPosition={this.setNorthPosition}
                                scene={currentScene}
                                view={view} />
                        )
                    }
                    {
                        srcAvailable && (
                            <RadarZone
                                {...this.state}
                                openModalFromRadar={this.openModalFromRadar}
                                setNorthPosition={this.setNorthPosition}
                                scene={currentScene.scene}
                                view={view} />
                        )
                    }
                </div>
                {
                    openModal && this.modalShowContent(contentGalleryId, openModal, modalContent)
                }
            </div>
        );
    }
}
export default withRouter(Panorama);
