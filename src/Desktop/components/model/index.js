import React from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Model } from "../../../Model3D/Model3D";
import { getGpsByLineID } from "../../../Model3D/constants";
import styles from "./style";
import "./style.css";
import ContentLoader from "../../../common/ContentLoader";

class Model3D extends React.Component {
    model;

    frameId;

    _frameId;

    componentDidMount() {
        const { lineID } = this.props.routeParams;
        this.model = new Model(
            "model-container",
            this.handleProgress,
            this.handleLoadedModel,
            getGpsByLineID(lineID),
        );
        this.model.initScene();
        this.startFrame();
        window.addEventListener("resize", this.onWindowResize);
    }

    onWindowResize = () => {
        this.model.updateFrameSize();
    };

    componentWillUnmount() {
        window.removeEventListener("resize", this.onWindowResize);
        this.stopFrames();
        this.model.destroy();
        this.props.setContentLoaded(false);
        this.props.setContentProgress(null);
    }

    handleProgress = ({ loaded, total }) => {
        const progress = parseInt((loaded / total) * 100, 10);
        this.props.setContentProgress(progress);
    };

    handleLoadedModel = () => {
        this.props.setContentLoaded(true);
    };

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
        const { classes, loaded, progress } = this.props;
        return (
            <div className={classes.modelContainer}>
                <ContentLoader
                    loaded={loaded}
                    progress={progress} />
                <div
                    className={classes.modelBox}
                    id="model-container" />
            </div>
        );
    }
}

Model3D.propTypes = {
    classes: PropTypes.object.isRequired,
    loaded: PropTypes.bool.isRequired,
    progress: PropTypes.any,
    setContentLoaded: PropTypes.func.isRequired,
    setContentProgress: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired,
};

export default withStyles(styles)(Model3D);
