import React from "react";
import ReactDOM from "react-dom";
import "./style.css";
import { Model } from "./Model3D";
import Map from "./map";
import { getData } from "../ContentProvider/fetch";
import ContentLoader from "../common/ContentLoader";

const hideLoader = () => {
    document.getElementById("site-loader").style.display = "none";
};

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            progress: 0,
            loaded: false,
            points: [],
            objectMap: false,
        };
    }

    cancel = [];

    model;

    frameId;

    _frameId;

    componentDidMount() {
        hideLoader();
        this.model = new Model(
            "model-container",
            this.handleProgress,
            this.handleLoadedModel,
        );
        this.model.showGui = true;
        this.model.initScene();
        this.startFrame();
        window.addEventListener("resize", this.onWindowResize);
    }

    componentWillUnmount() {
        this.stopFrames();
        this.model.destroy();
        window.removeEventListener("resize", this.onWindowResize);
    }

    startFrame = () => {
        if (!this._frameId) {
            this._frameId = window.requestAnimationFrame(this.frame);
        }
    };

    frame= () => {
        this.model.render();
        this.frameId = window.requestAnimationFrame(this.frame);
    };

    stopFrames = () => {
        window.cancelAnimationFrame(this._frameId);
    };

    onWindowResize = () => {
        this.model.updateFrameSize();
    };

    handleProgress = ({ loaded, total }) => {
        const progress = parseInt((loaded / total) * 100, 10);
        this.setState({ progress });
    };

    handleLoadedModel = () => this.setState({ loaded: true });

    async getSublines() {
        const url = "/user/api/lines/44/content/aeropanorama";
        const { payload } = await this.fetchData(url);
        const [aero] = payload;
        const meta = JSON.parse(aero.meta);
        const points = meta.sublinePolygons;
        return points.filter((point) => point.gps).map(({ gps }) => gps);
    }

    async fetchData(url) {
        try {
            const [promise, cancel] = await getData({ url }, true);
            this.cancel.push(cancel);
            return promise;
        } catch (e) {
            console.error("Wrong request in LeafLet Component...", e);
            return [];
        }
    }

    changePoint = (objectPoint) => {
        this.setState({ objectPoint });
        this.model.stage.changePoint(objectPoint);
    };

    render() {
        const { progress, loaded, objectMap } = this.state;
        return (
            <React.Fragment>
                <ContentLoader
                    loaded={loaded}
                    progress={progress} />
                <div id="model-container" />
                {
                    objectMap && <Map changePoint={this.changePoint} />
                }
            </React.Fragment>
        );
    }
}

ReactDOM.render((<App />), document.getElementById("root"));
