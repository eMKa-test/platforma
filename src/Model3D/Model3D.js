/* eslint-disable */
import * as TJ from "three";
import { Stage } from "./Stage";
import { getDomParams, clearOwnProperties } from "./helper";
import "./modelStyle.css";

function Model(domElementID, onProgress, onLoaded, objectGPS, cacheModel) {
    this.domElementID = domElementID;
    this.dom = document.getElementById(domElementID);
    this.domProps = getDomParams(this.dom);
    this.scene = new TJ.Scene();
    this.scene.background = new TJ.Color(0x000000);
    this.showGui = false;
    this.stage = new Stage(this, onProgress, onLoaded, objectGPS, cacheModel);
    this.renderer = new TJ.WebGLRenderer({
        antialias: true, autoClear: true, preserveDrawingBuffer: true,
    });
}

Model.prototype.initScene = function () {
    const { width, height } = this.domProps;
    this.renderer.setClearColor(0x050505);
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.dom.appendChild(this.renderer.domElement);
    this.stage.allStagesRun(this.showGui);
};

Model.prototype.render = function () {
    if (this.renderer && this.stage.control)    {
        this.renderer.render(this.scene, this.stage.camera);
        this.stage.control.update();
        if (this.stage.raycaster && this.stage.mouseVector) {
            this.stage.updateRayCaster();
        }
    }
};

Model.prototype.updateFrameSize = function() {
    this.domProps = getDomParams(document.getElementById(this.domElementID));
    onResize.call(this);
};

function onResize() {
    const { width, height } = this.domProps;
    this.stage.domProps = this.domProps;
    this.stage.camera.aspect = width / height;
    this.stage.camera.updateProjectionMatrix();

    const dpr = this.renderer.getPixelRatio();
    this.renderer.setSize(width * dpr, height * dpr);
}

Model.prototype.destroy = function() {
    this.scene.dispose();
    this.renderer.dispose();
    this.stage.control.dispose();
    this.stage.destroy();
    clearOwnProperties(this);
};

export { Model };
