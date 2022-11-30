import * as TJ from "three";
import { Gui } from "./gui";
import { directionLightHlper } from "./helper";
import {
    OBJECT_POSITION_VAL,
    OBJECT_ROTATION_VAL,
    OBJECT_SCALE_VAL,
    CAMERA_ANGLE_VAL,
    CAMERA_DISTANCE_VAL,
    CAMERA_POSITION_VAL,
    CAMERA_PROJECTION_VAL,
} from "./constants";

function onchange(helper) {
    return () => helper.update();
}

const borderLines = ({ width, height }) => {
    const positions = [
        [0, -5, 0], [0, 50, 0],
        [0, 50, -height / 2], [0, 50, height / 2], [0, 50, 0],
        [-width / 2, 50, 0], [width / 2, 50, 0],
    ];
    return positions.map((pos) => new TJ.Vector3(...pos));
};

class Helpers {
    constructor({
        dom, scene, camera, control, directionLight, objectModel, cgps,
    }) {
        this.dom = dom;
        this.scene = scene;
        this.camera = camera;
        this.control = control;
        this.directionLight = directionLight;
        this.objectModel = objectModel;
        this.cgps = cgps;
        this.gui = new Gui(this.dom);
        this.gui.show();
    }

    showGuiHelper() {
        this.sceneHelper();
        this.objectModelHelper();
        this.directionLightHelper();
        this.createBorderObjectPoints();
    }

    sceneHelper() {
        this.gui.folder("Scene");
        // change limits of control
        this.gui.changeSubProperties(
            "Scene", "camera limit", this.control, "minPolarAngle", CAMERA_ANGLE_VAL,
            () => onchange(this.control),
        );
        this.gui.changeSubProperties(
            "Scene", "camera limit", this.control, "maxPolarAngle", CAMERA_ANGLE_VAL,
            () => onchange(this.control),
        );
        this.gui.changeSubProperties(
            "Scene", "camera limit", this.control, "minDistance", CAMERA_DISTANCE_VAL,
            () => onchange(this.control),
        );
        this.gui.changeSubProperties(
            "Scene", "camera limit", this.control, "maxDistance", CAMERA_DISTANCE_VAL,
            () => onchange(this.control),
        );
        // change camera position
        this.gui.changeSubProperties(
            "Scene", "camera position", this.camera.position, "x", CAMERA_POSITION_VAL,
            () => this.camera.updateProjectionMatrix(),
        );
        this.gui.changeSubProperties(
            "Scene", "camera position", this.camera.position, "y", CAMERA_POSITION_VAL,
            () => this.camera.updateProjectionMatrix(),
        );
        this.gui.changeSubProperties(
            "Scene", "camera position", this.camera.position, "z", CAMERA_POSITION_VAL,
            () => this.camera.updateProjectionMatrix(),
        );
        // change camera projection
        this.gui.changeSubProperties(
            "Scene", "camera projection", this.camera, "fov", CAMERA_PROJECTION_VAL.fov,
            () => this.camera.updateProjectionMatrix(),
        );
        this.gui.changeSubProperties(
            "Scene", "camera projection", this.camera, "near", CAMERA_PROJECTION_VAL.near,
            () => this.camera.updateProjectionMatrix(),
        );
        this.gui.changeSubProperties(
            "Scene", "camera projection", this.camera, "far", CAMERA_PROJECTION_VAL.far,
            () => this.camera.updateProjectionMatrix(),
        );
    }

    objectModelHelper() {
        this.gui.folder("Model");
        // change model scale x/y/z
        this.gui.changeSubProperties(
            "Model", "scale", this.objectModel.scale, "x", OBJECT_SCALE_VAL,
        );
        this.gui.changeSubProperties(
            "Model", "scale", this.objectModel.scale, "y", OBJECT_SCALE_VAL,
        );
        this.gui.changeSubProperties(
            "Model", "scale", this.objectModel.scale, "z", OBJECT_SCALE_VAL,
        );
        // change model position x/y/z
        this.gui.changeSubProperties(
            "Model", "position", this.objectModel.position, "x", OBJECT_POSITION_VAL,
        );
        this.gui.changeSubProperties(
            "Model", "position", this.objectModel.position, "y", OBJECT_POSITION_VAL,
        );
        this.gui.changeSubProperties(
            "Model", "position", this.objectModel.position, "z", OBJECT_POSITION_VAL,
        );
        // change model rotate x/y/z
        this.gui.changeSubProperties(
            "Model", "rotation", this.objectModel.rotation, "x", OBJECT_ROTATION_VAL,
        );
        this.gui.changeSubProperties(
            "Model", "rotation", this.objectModel.rotation, "y", OBJECT_ROTATION_VAL,
        );
        this.gui.changeSubProperties(
            "Model", "rotation", this.objectModel.rotation, "z", OBJECT_ROTATION_VAL,
        );
    }

    createBorderObjectPoints() {
        // object model borders from GPS
        const points = this.cgps.vertexes();
        points.forEach((point, i) => {
            const material = new TJ.LineBasicMaterial({ color: "red" });
            const linePoints = [];
            const dirX = i === 0 || i === 3 ? 1 : -1;
            const dirZ = i === 0 || i === 1 ? -1 : 1;
            linePoints.push(new TJ.Vector3(point[0] - this.cgps.width / 2, 0, point[1] - this.cgps.height / 2));
            linePoints.push(new TJ.Vector3(point[0] - this.cgps.width / 2, 50, point[1] - this.cgps.height / 2));
            linePoints.push(new TJ.Vector3(point[0] - this.cgps.width / 2, 0, point[1] - this.cgps.height / 2));
            linePoints.push(new TJ.Vector3(point[0] - this.cgps.width / 2 + ((dirX * this.cgps.width) / 8), 0, point[1] - this.cgps.height / 2));
            linePoints.push(new TJ.Vector3(point[0] - this.cgps.width / 2, 0, point[1] - this.cgps.height / 2));
            linePoints.push(new TJ.Vector3(point[0] - this.cgps.width / 2, 0, point[1] - this.cgps.height / 2 + ((dirZ * this.cgps.width) / 8)));
            const geometry = new TJ.BufferGeometry().setFromPoints(linePoints);
            const line = new TJ.Line(geometry, material);
            this.scene.add(line);
        });
        const material = new TJ.LineBasicMaterial({ color: "red", linewidth: 20 });
        const geometry = new TJ.BufferGeometry().setFromPoints(borderLines(this.cgps));
        const line = new TJ.Line(geometry, material);
        this.scene.add(line);
    }

    directionLightHelper() {
        // change "sun-light" position
        this.gui.folder("Direction");
        this.gui.changeProperties("Direction", this.directionLight, "intensity", [0, 5, 0.05]);
        this.gui.changeProperties("Direction", this.directionLight.position, "x", [-500, 500, 0.5]);
        this.gui.changeProperties("Direction", this.directionLight.position, "y", [-500, 500, 0.5]);
        this.gui.changeProperties("Direction", this.directionLight.position, "z", [-500, 500, 0.5]);
        const helper = directionLightHlper(this.directionLight);
        // change "sun-light" angle
        this.gui.changeSubProperties(
            "Direction", "angle", this.directionLight.target.position, "x", [-500, 500, 0.5], onchange(helper),
        );
        this.gui.changeSubProperties(
            "Direction", "angle", this.directionLight.target.position, "y", [-500, 500, 0.5], onchange(helper),
        );
        this.gui.changeSubProperties(
            "Direction", "angle", this.directionLight.target.position, "z", [-500, 500, 0.5], onchange(helper),
        );
        this.scene.add(this.directionLight.target);
        this.scene.add(helper);
    }
}

export { Helpers };

export default null;
