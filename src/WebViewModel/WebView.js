import React from "react";
import * as PropTypes from "prop-types";
import { Model } from "../Model3D/Model3D";
import ContentLoader from "../common/ContentLoader";
import "./style.css";

// Linear Progress -bar
const LoaderWithProgressBar = ({ loaded, progress }) => (
    <div className={`model3d-container ${!loaded ? "model3d-hide" : "model3d-show"}`}>
        <div className="model3d-loader">
            <span
                className="model3d-loader-progressbar"
                style={{ width: `${progress}%` }} />
            <span className="model3d-loader-progress">
                {`${progress}%`}
            </span>
        </div>
    </div>
);

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            progress: 0,
            loaded: false,
            points: [],
        };
    }

    model;

    frameId;

    _frameId;

    componentDidMount() {
        if (typeof this.props.onMount === "function") {
            this.props.onMount();
        }
        this.model = new Model(
            "model-container",
            this.handleProgress,
            this.handleLoadedModel,
        );
        this.model.stage.modelQuality = "lq";
        this.model.initScene();
        this.startFrame();
    }

    componentWillUnmount() {
        this.stopFrames();
        this.model.destroy();
    }

    handleProgress = ({ loaded, total }) => {
        const progress = parseInt((loaded / total) * 100, 10);
        this.setState({ progress });
    };

    handleLoadedModel = () => this.setState({ loaded: true });

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

    render() {
        const { progress, loaded } = this.state;
        return (
            <React.Fragment>
                <ContentLoader
                    loaded={loaded}
                    progress={progress} />
                <div id="model-container" />
            </React.Fragment>
        );
    }
}

App.propTypes = {
    onMount: PropTypes.func,
};

export default App;
