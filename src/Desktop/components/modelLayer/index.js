import React from "react";
import * as PropTypes from "prop-types";
import throttle from "lodash/throttle";
import { withStyles } from "@material-ui/core";
import classNames from "classnames";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import isEqual from "lodash/isEqual";
import styles from "./styles";
import { Model } from "../../../Model3D/Model3D";
import { getGpsByLineID } from "../../../Model3D/constants";
import { getData } from "../../../ContentProvider/fetch";
import ContentLoader from "../../../common/ContentLoader";
import LinearLoader from "../linearLoader";
import FullscreenFromModel from "./FullscreenFromModel";
import { MODEL_3D } from "../../../constants";
import Loader from "../loader";

class ModelLayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: null,
            content: [],
            reloadDate: false,
            changeQuality: false,
            quality: null,
        };
    }

    cancel = [];

    model;

    frameId;

    componentDidUpdate(prevProps) {
        if (!isEqual(this.state.content, this.props.contentData)
            || (this.props.modeModel && prevProps.params.date !== this.props.params.date)) {
            this.setContentFromTab(this.props.contentData);
        }
        if (this.props.loadRun && prevProps.loadRun !== this.props.loadRun) {
            this.launchModel();
        }
        if (!this.model && this.props.cacheModel[this.props.params.lineID]) {
            this.launchModel();
        }
        if (this.model) {
            if (!this.props.modeModel && prevProps.modeModel !== this.props.modeModel) {
                this.stopFrames();
            }
            if (this.props.modeModel && prevProps.modeModel !== this.props.modeModel) {
                this.loop();
            }
        }
    }

    launchModel = () => {
        const { params: { lineID }, cacheModel } = this.props;
        const modelFromCache = cacheModel[lineID];
        this.model = new Model(
            "model-layer-box", null, this.handleLoadedModel, getGpsByLineID(lineID), modelFromCache,
        );
        this.model.stage.addEventListener("reload", this.checkLoadPoints);
        this.model.stage.getPoint = this.getPoint;
        this.model.stage.toCache = this.formCacheModel;
        this.model.stage.renderContentPoints(this.state.content);
        this.model.initScene();
        this.setState({ quality: this.model.stage.modelQuality });
        window.addEventListener("resize", this.onWindowResize);
    };

    setContentFromTab = (content) => {
        this.setState({ reloadDate: true, content }, () => {
            if (this.model) {
                this.model.stage.renderContentPoints(content);
            }
        });
    };

    async fetchData(url, params) {
        const [promise, cancel] = getData({ url, params }, true);
        this.cancel.push(cancel);
        return promise;
    }

    checkLoadPoints = ({ reloadDate }) => {
        this.setState({ reloadDate });
    };

    getPoint = (point) => {
        if (point === null) {
            this.setState({ index: point }, this.loop);
            return;
        }
        const { content } = this.state;
        const index = content.findIndex((item) => point.id === item.id);
        this.setState({ index }, this.stopFrames);
    };

    formCacheModel = (quality, object) => {
        const result = {
            [this.props.params.lineID]: {
                ...this.props.cacheModel[this.props.params.lineID],
                [quality]: object,
            },
        };
        this.model.stage.cacheStore = result[this.props.params.lineID];
        this.props.setCacheModel(result);
    };

    changeQualityHandler = (value) => () => {
        if (!this.state.changeQuality) {
            this.setState({ changeQuality: true, quality: value }, () => {
                this.model.stage.changeModelByQuality(value, () => {
                    this.setState({ changeQuality: false });
                });
            });
        }
    };

    modelQualityButtons = () => {
        if (this.model) {
            const { classes } = this.props;
            const { quality } = this.state;
            const quals = this.model.stage.getModelQualityList();
            return (
                <div className={classes.modelQualityTogglerContainer}>
                    {quals.map((qual) => (
                        <button
                            type="button"
                            className={classNames(classes.modelQualityButton, {
                                [classes.modelQualityButtonSelected]: quality === qual,
                            })}
                            key={qual}
                            onClick={this.changeQualityHandler(qual)}>
                            {qual.toUpperCase()}
                        </button>
                    ))}
                </div>
            );
        }
        return null;
    };

    destroyScene = (callback) => {
        this.stopFrames();
        this.model.destroy();
        if (typeof callback === "function") {
            callback();
        }
    };

    componentWillUnmount() {
        if (this.model) {
            window.removeEventListener("resize", this.onWindowResize);
            this.model.stage.removeEventListener("reload", this.checkLoadPoints);
            this.destroyScene();
        }
        if (this.cancel.length > 0) {
            this.cancel.forEach((canFn) => {
                if (typeof canFn === "function") {
                    canFn();
                }
            });
        }
    }

    handleLoadedModel = () => {
        this.props.runLoadModel(false);
    };

    onWindowResize = throttle(() => this.resizeFrame(), 100);

    resizeFrame = () => {
        if (this.model) {
            this.model.updateFrameSize();
        }
    };

    startFrame = () => {
        if (!this.frameId) {
            this.frameId = window.requestAnimationFrame(this.loop);
        }
    };

    loop = () => {
        this.frameId = undefined;
        this.model.render();
        this.startFrame();
    };

    stopFrames = () => {
        if (this.frameId) {
            window.cancelAnimationFrame(this.frameId);
        }
        this.frameId = undefined;
    };

    render() {
        const {
            classes, modeModel, showModel, loadRun,
        } = this.props;
        const {
            reloadDate, changeQuality, index, content,
        } = this.state;
        return (
            <Slide
                direction="left"
                in={modeModel}>
                <div className={classes.modelLayerContainer}>
                    <div className={classes.modelLayer}>
                        <button
                            type="button"
                            onClick={() => showModel(false)}
                            className={classes.closeModelButton}>
                            <CloseIcon color="secondary" />
                        </button>
                        <div
                            id="model-layer-box"
                            className={classNames(classes.modelBox,
                                {
                                    [classes.reloadContent]: reloadDate,
                                    [classes.reloadQuality]: changeQuality,
                                })} />
                        {index !== null && ["IMAGE", "VIDEO"].includes(content[index].type) && (
                            <FullscreenFromModel
                                idx={index}
                                content={content}
                                contentType={MODEL_3D}
                                onClose={this.getPoint} />
                        )}
                        {this.modelQualityButtons()}
                        {changeQuality && (
                            <div className={classes.qualityLoader}>
                                <Loader
                                    size={80}
                                    thickness={2} />
                            </div>
                        )}
                        {reloadDate && <LinearLoader />}
                        <ContentLoader loaded={!loadRun} />
                    </div>
                </div>
            </Slide>
        );
    }
}

ModelLayer.propTypes = {
    classes: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    modeModel: PropTypes.bool.isRequired,
    showModel: PropTypes.func.isRequired,
    runLoadModel: PropTypes.func.isRequired,
    cacheModel: PropTypes.object.isRequired,
    setCacheModel: PropTypes.func.isRequired,
    loadRun: PropTypes.bool.isRequired,
    contentData: PropTypes.array,
};

export default withStyles(styles)(ModelLayer);
