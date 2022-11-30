/* eslint-disable */
import * as TJ from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { MtlObjBridge } from "three/examples/jsm/loaders/obj2/bridge/MtlObjBridge";
import { CONTROL_OPTIONS, LIGHT_OPTIONS, CAMERA_OPTIONS, DEFAULT_OBJECT } from "./constants";
import { onError, clearOwnProperties } from "./helper";
import defaultGround from "./assets/textures/goo.png";
import { ConGPS } from "./TransformGPS";
import { Helpers } from "./Helpers";

function Stage(
    { dom, domProps, scene },
    onProgress, onLoaded, objectGPS = DEFAULT_OBJECT, cacheModel,
) {
    const cameraInitial = Object.values(CAMERA_OPTIONS.init(domProps.width, domProps.height));
    this.onProgress = onProgress;
    this.onLoaded = onLoaded;
    this.camera = new TJ.PerspectiveCamera(...cameraInitial);
    this.control = new OrbitControls(this.camera, dom);
    this.scene = scene;
    this.dom = dom;
    this.domProps = domProps;
    this.cacheStore = cacheModel;
    this.objectModel = {};
    this.objectProperties = {...objectGPS};
    this.renderedContentPoints = [];
    this.raycaster = new TJ.Raycaster();
    this.mouseVector = new TJ.Vector2();
    this.dom.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.dom.addEventListener("click", this.onMouseClick.bind(this), false);
    this.setObjectGPS(objectGPS);
    this.checkModelQualityForSetDefault();
}
Object.assign(Stage.prototype, TJ.EventDispatcher.prototype);
Object.assign(Stage.prototype, {
    checkModelQualityForSetDefault() {
        const quals = Object.keys(this.objectProperties.model);
        if (!this.modelQuality && quals.length > 0) {
            this.modelQuality = quals[0];
        }
    },

    setObjectGPS(objectGPS) {
        if (objectGPS) {
            this.cgps = new ConGPS(objectGPS.se, objectGPS.nw);
        }
    },

    renderContentPoints(contentArray) {
        this.contentPoints = contentArray || [];
        this.cleanSceneFromPoints(this.createContentPoints);
    },

    createCamera() {
        this.camera.position.set(...CAMERA_OPTIONS.position);
        this.camera.updateProjectionMatrix();
    },

    createControl() {
        Object.assign(this.control, CONTROL_OPTIONS);
    },

    createAmbientLight() {
        const initial = Object.values(LIGHT_OPTIONS.ambient.initial);
        this.ambientLight = new TJ.AmbientLight(...initial);
        this.ambientLight.position.set(...LIGHT_OPTIONS.ambient.position);
        this.scene.add(this.ambientLight);
    },

    createDirectionLight() {
        const initial = Object.values(LIGHT_OPTIONS.directional.main.initial);
        this.directionLight = new TJ.DirectionalLight(...initial);
        this.directionLight.position.set(...LIGHT_OPTIONS.directional.main.position);
        this.directionLight.target.position.set(...LIGHT_OPTIONS.directional.target.position);
        this.scene.add(this.directionLight);
    },

    createGround(groundTexture = defaultGround) {
        const planeTexture = loadTexture(groundTexture, 15);
        const groundGeom = new TJ.PlaneBufferGeometry(10000, 10000, 20, 20);
        const groundMaterial = new TJ.MeshLambertMaterial({
            map: planeTexture,
            wireframe: false,
            side: TJ.DoubleSide,
        });
        groundMaterial.color.setHSL( 0.08, 1, 0.8);
        const mesh = new TJ.Mesh(groundGeom, groundMaterial);
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.rotation.x -= Math.PI / 2;
        this.scene.add(mesh);
    },

    changeModelByQuality(modelQuality, callBack) {
        this.modelQuality = modelQuality;
        this.creatOBJMTLModel(callBack);
    },

    creatOBJMTLModel(callBack) {
        if (!this.cacheStore || !this.cacheStore[this.modelQuality]) {
            const mtLoader = new MTLLoader();
            mtLoader.load(this.objectProperties.model[this.modelQuality].mtl, (material) => {
                material.preload();
                const objLoader = new OBJLoader2();
                objLoader.addMaterials( MtlObjBridge.addMaterialsFromMtlLoader( material ), true );
                objLoader.load(this.objectProperties.model[this.modelQuality].obj,
                    (obj) => {
                        obj.scale.set(...Object.values(this.objectProperties.properties.scale));
                        obj.position.set(...Object.values(this.objectProperties.properties.position));
                        obj.rotation.set(...Object.values(this.objectProperties.properties.rotation));
                        this.toCache(this.modelQuality, obj);
                        this.scene.add(obj);
                        if (this.objectModel) {
                            this.scene.remove(this.objectModel);
                        }
                        this.objectModel = obj;
                        this.onLoaded();
                        if (callBack) {
                            callBack(obj);
                        }
                    },
                    (xhr) => {
                        if (!this.loadModel) {
                            this.loadModel = xhr;
                        }
                        if (this.onProgress && typeof this.onProgress === "function") {
                            this.onProgress(xhr);
                        }
                    },
                );
            });
        } else {
            this.scene.remove(this.objectModel);
            this.objectModel = this.cacheStore[this.modelQuality];
            this.scene.add(this.objectModel);
            if (callBack) {
                callBack(this.objectModel);
            }
        }
    },

    toCache(object) {
        return object;
    },

    allStagesRun(withGui) {
        this.createCamera();
        this.createControl();
        this.creatOBJMTLModel((object) => {
            this.createAmbientLight();
            this.createDirectionLight();
            this.createGround();
            if (withGui) {
                try {
                    const helpers = new Helpers(this);
                    helpers.showGuiHelper();
                } catch (e) {
                    console.error("Gui-helper occured Error", e);
                }
            }
        });
    },

    createContentPoints() {
        this.contentPoints.forEach((point, i) => {
            if (point.gps && point.gps.lat && point.gps.long) {
                const {x, z} = this.cgps.getScreenCoords(point.gps);
                // const pointLight = new TJ.PointLight(0xC1A779, 0, 15, 4);
                const sphere = new TJ.SphereGeometry(4, 30, 30);
                let mat = new TJ.MeshPhysicalMaterial(
                    {
                        color: 0xF95656,
                        clearcoat: 0,
                        clearcoatRoughness: 0,
                        reflectivity: 0.15,
                        roughness: 0.65,
                        metalness: 0.3,
                    });
                const pointObject = new TJ.Mesh(sphere, mat);
                // pointObject.add(pointLight);
                pointObject.position.add(new TJ.Vector3(x, 10, z));
                pointObject.castShadow = true;
                pointObject.receiveShadow = true;
                pointObject.callback = this.onPointClick(point);
                this.renderedContentPoints.push(pointObject);
                this.scene.add(pointObject);
            }
        });
        this.dispatchEvent({ type: "reload", reloadDate: false });
    },

    updateRayCaster() {
        this.camera.updateProjectionMatrix();
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        const intersects = this.raycaster.intersectObjects(this.renderedContentPoints);
        if (intersects.length > 0) {
            if (this.selectedPoint !== intersects[0].object ) {
                if (this.selectedPoint ) {
                    // this.selectedPoint.children[0].intensity = 0;
                    this.selectedPoint.material.color = new TJ.Color(0xF95656);
                }
                this.selectedPoint = intersects[0].object;
                // this.selectedPoint.children[0].intensity = 8;
                this.selectedPoint.material.color = new TJ.Color(0x419BE3);
                this.dom.style.cursor = "pointer";
            }
        } else {
            if (this.selectedPoint) {
                this.selectedPoint.material.color = new TJ.Color(0xF95656);
                // this.selectedPoint.children[0].intensity = 0;
            }
            this.selectedPoint = null;
            this.dom.style.cursor = "default";
        }
    },

    onMouseMove(e) {
        e.preventDefault();
        this.mouseVector.x = ((e.clientX - 270) / this.domProps.width) * 2 - 1;
        this.mouseVector.y = -((e.clientY - this.domProps.top) / this.domProps.height) * 2 + 1;
    },

    onMouseClick(e) {
        e.preventDefault();
        this.mouseVector.x = ((e.clientX - 270) / this.domProps.width) * 2 - 1;
        this.mouseVector.y = -((e.clientY - this.domProps.top) / this.domProps.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        const intersects = this.raycaster.intersectObjects(this.renderedContentPoints);
        if (intersects.length > 0) {
            intersects[0].object.callback();
        }
    },

    onPointClick(point) {
        const scope = this;
        return function() {
            scope.getPoint(point);
        }
    },

    getPoint(point) {
        return point;
    },

    getModelQualityList() {
        return Object.keys(this.objectProperties.model);
    },

    cleanSceneFromPoints(callback) {
        if (this.renderedContentPoints.length > 0) {
            this.renderedContentPoints.forEach((point) => {
                this.scene.remove(point);
            });
        }
        this.renderedContentPoints = [];
        if (callback && typeof callback === "function") {
            callback.call(this);
        }
    },

    destroy() {
        if (this.loadModel && this.loadModel.currentTarget) {
            this.loadModel.currentTarget.abort();
        }
        this.dom.removeEventListener( 'mousemove', this.onMouseMove.bind(this));
        this.dom.removeEventListener("click", this.onMouseClick.bind(this), false);
        clearOwnProperties(this);
    },
});

function loadTexture(src, val) {
    try {
        const texture = new TJ.TextureLoader().load(src, () => {}, null, onError);
        texture.anisotropy = 16;
        texture.center.set(0.5, 0.5);
        texture.wrapS = TJ.RepeatWrapping;
        texture.wrapT = TJ.RepeatWrapping;
        texture.repeat.set(val, val);
        return texture;
    } catch (e) {
        console.log(e);
    }
    return null;
}

export { Stage };
