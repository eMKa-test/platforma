import React from "react";
import * as PropTypes from "prop-types";
import { Aero, eventFlip } from "./Aero";
import axios from "../Desktop/common/axios";
import Stub from "./stub";
import ArrowSteps from "./stepBlock";
import CloseButton from "../Desktop/common/buttons/close";
import ContentLoader from "../common/ContentLoader";
import { takeObjectFromArray } from "./helpers";
import "./style.css";
import metrikaEvents, {
    AEROPANORAMA_SUBLINE_ENTER, AEROPANORAMA_SUBLINE_PAN_STEPS,
} from "../common/Metrika";

class AeroPanorama extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            yaw: 0,
            pitch: 0,
            panMode: 0,
            subPanOnScenes: [],
            subPanIndex: 0,
            loaded: false,
            sublineinfo: null,
        };
    }

    cancel = [];

    aero;

    componentDidMount() {
        this.aero = new Aero("aero-dom", this.onChangeScene);
        if (!this.props.webview) {
            this.aero.onLoaded(this.onLoadedStartPan);
            const { contentID } = this.props;
            try {
                this.getSublinePanoramas()
                    .then(({ payload }) => {
                        this.aero.loadContent(this.props.media, payload, contentID);
                    });
            } catch (e) {
                console.error(e);
            }
            window.addEventListener("keydown", this.keyListen);
        }
        eventFlip.on("rotation", this.listenPanCoords);
        eventFlip.on("viewMode", this.setPanMode);
    }

    onChangeScene = (id) => {
        if (!this.props.webview) {
            const { routeParams: { companySlug, lineID, tab }, date } = this.props;
            const url = `/${companySlug}/content/${lineID}/${tab}/${date}/${id}`;
            this.props.setContentId(url);
        } else {
            this.props.changeContentID(id);
        }
    };

    onLoadedStartPan = () => {
        this.props.setContentLoaded(true);
    };

    componentDidUpdate(prevProps, prevState) {
        if (!this.props.webview) {
            const { contentID, sublineMode } = this.props;
            if (prevProps.contentID !== contentID) {
                this.aero.changeAeroScene(contentID);
            }
            if (prevProps.sublineMode !== sublineMode && !sublineMode) {
                this.closeSublineMode();
            }
        } else {
            const { contentID, aeropanoramas, sublines } = this.props;
            if (prevProps.contentID !== contentID) {
                try {
                    this.aero.loadContent(aeropanoramas, sublines, contentID);
                    // this.aero.changeAeroScene(contentID);
                } catch (e) {
                    console.error(e);
                }
            }
        }
        if (prevState.panMode !== this.state.panMode && this.state.panMode && !this.props.webview) {
            const { routeParams: { companySlug, lineID } } = this.props;
            const { sublineinfo } = this.state;
            const meta = {
                ...sublineinfo.subline,
                aeroId: sublineinfo.aeroId,
                company: companySlug,
                lineID,
            };
            metrikaEvents.emit(AEROPANORAMA_SUBLINE_ENTER, meta);
        }
    }

    componentWillUnmount() {
        if (!this.props.webview) {
            if (this.cancel.length > 0) {
                this.cancel.forEach((cancelFn) => {
                    if (typeof cancelFn === "function") {
                        cancelFn();
                    }
                });
            }
            window.removeEventListener("keydown", this.keyListen);
            if (this.state.panMode) {
                this.metrikaStepCount();
            }
            this.props.setSublineMode(false);
            this.props.setContentLoaded(false);
        }
        eventFlip.off("rotation", this.listenPanCoords);
        eventFlip.off("viewMode", this.setPanMode);
        this.aero.destroy();
    }

    listenPanCoords = (coords) => {
        this.setState({ ...coords });
    };

    setPanMode = ({
        panMode, subPanOnScenes, subPanIndex, sublineinfo,
    }) => {
        if (!this.props.webview) {
            const mode = Boolean(panMode);
            this.props.setSublineMode(mode);
        }
        this.setState({
            panMode, subPanOnScenes, subPanIndex, sublineinfo,
        });
    };

    async getSublinePanoramas() {
        try {
            const { routeParams: { lineID }, date } = this.props;
            const url = `/user/api/lines/${lineID}/content/panorama?dateFrom=${date}`;
            const [cancel, promise] = axios("get", url, null, true);
            this.cancel.push(cancel);
            return promise;
        } catch (e) {
            return [];
        }
    }

    keyListen = (e) => {
        if (e.keyCode === 27 && this.state.panMode === 1) {
            this.props.setSublineMode(false);
        }
    };

    closeSublineMode = () => {
        if (!this.props.webview) {
            this.metrikaStepCount(this.aero.closeSublineMode);
        } else {
            this.aero.closeSublineMode();
        }
    };

    metrikaStepCount = (closeCallback) => {
        if (!this.props.webview) {
            const {
                countSubPanSteps,
                currentSubline: { id: subId },
                currentAeroScene: { id: aeroId, sublines },
            } = this.aero;
            const { routeParams: { companySlug, lineID }, date } = this.props;
            const meta = {
                company: companySlug,
                lineID,
                aeroId,
                subId,
                subPansDate: date,
                subName: takeObjectFromArray(sublines, subId, "id", "title"),
                subPanSteps: countSubPanSteps,
            };
            if (closeCallback && typeof closeCallback === "function") {
                closeCallback = closeCallback.bind(this.aero);
            }
            metrikaEvents.emit(AEROPANORAMA_SUBLINE_PAN_STEPS, meta, closeCallback);
        }
    };

    switchSublineScene = (id) => {
        this.aero.switchSublineScene(id);
    };

    render() {
        const { panMode } = this.state;
        const { webview, loaded } = this.props;
        return (
            <div
                className="marz-container_wrapper-panorams">
                {!webview && (
                    <ContentLoader loaded={loaded} />
                )}
                <div id="aero-dom">
                    {
                        panMode === 1 && webview && (
                            <CloseButton
                                extendClassBtn="marz-container__close-subline-btn"
                                extendClassVal="marz-container__close-subline-btn-value"
                                onClick={this.closeSublineMode} />
                        )
                    }
                    {
                        panMode === 1 && (
                            <ArrowSteps
                                {...this.state}
                                {...this.props}
                                switchSublineScene={this.switchSublineScene} />
                        )
                    }
                </div>
            </div>
        );
    }
}

AeroPanorama.propTypes = {
    media: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    aeropanoramas: PropTypes.array,
    sublines: PropTypes.array,
    setSublineMode: PropTypes.func,
    changeContentID: PropTypes.func,
    date: PropTypes.string,
    routeParams: PropTypes.object,
    setContentId: PropTypes.func,
    webview: PropTypes.bool,
    contentID: PropTypes.string,
    setContentLoaded: PropTypes.func.isRequired,
    loaded: PropTypes.bool,
    sublineMode: PropTypes.bool.isRequired,
};

export default AeroPanorama;
