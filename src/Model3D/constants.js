export const CAMERA_OPTIONS = {
    init(width, height) {
        return {
            fov: 64.5,
            aspect: width / height,
            near: 0.1,
            far: 5000,
        };
    },
    position: [147, 148, 330],
};
export const CONTROL_OPTIONS = {
    autoRotate: false,
    autoRotateSpeed: 1.5,
    enableDamping: true,
    enablePan: true,
    enableZoom: true,
    enableKeys: false,
    minPolarAngle: 0.5,
    maxPolarAngle: 1.5,
    rotateSpeed: 0.4,
    minDistance: 100,
    maxDistance: 350,
};

export const LIGHT_OPTIONS = {
    ambient: {
        initial: { color: "#ffffff", intens: 0.4 },
        position: [20, 50, 40],
    },
    directional: {
        main: {
            initial: { color: "#ffffff", intens: 1.05 },
            position: [10.5, 228.5, 119.5],
        },
        target: { position: [-118, -32, -9.5] },
    },
};

export const OBJECT_POSITION_VAL = [-1000, 1000, 0.05];
export const OBJECT_ROTATION_VAL = [-180, 180, 0.05];
export const OBJECT_SCALE_VAL = [0, 50, 0.05];

export const CAMERA_ANGLE_VAL = [-Math.PI, Math.PI, 0.05];
export const CAMERA_DISTANCE_VAL = [100, 2000, 0.5];
export const CAMERA_POSITION_VAL = [-2000, 20000, 0.5];
export const CAMERA_PROJECTION_VAL = {
    fov: [0, 150, 0.5],
    near: [0, 20, 0.05],
    far: [0, 100000, 1],
};

const OBJECT_PROPERTIES = {
    1: {
        // UPGT
        se: {
            lat: 59.57010476,
            long: 28.23517886,
        },
        nw: {
            lat: 59.5670175,
            long: 28.24540231,
        },
        properties: {
            position: { x: -237.1, y: 2.5, z: 162.45 },
            rotation: { x: -1.575, y: 0, z: 0 },
            scale: { x: 14.25, y: 14.25, z: 14.25 },
        },
        model: {
            lq: {
                obj: "/public/assets/models/upgtLow/oil-10-model.obj",
                mtl: "/public/assets/models/upgtLow/oil-10-model.mtl",
            },
            mq: {
                obj: "/public/assets/models/upgtMiddle/oil-40-model.obj",
                mtl: "/public/assets/models/upgtMiddle/oil-40-model.mtl",
            },
            hq: {
                obj: "/public/assets/models/upgtObj/model-15.03.20.obj",
                mtl: "/public/assets/models/upgtObj/model-15.03.20.mtl",
            },
        },
    },
    44: {
        // UPGT
        se: {
            lat: 59.57010476,
            long: 28.23517886,
        },
        nw: {
            lat: 59.5670175,
            long: 28.24540231,
        },
        properties: {
            position: { x: -237.1, y: 2.5, z: 162.45 },
            rotation: { x: -1.575, y: 0, z: 0 },
            scale: { x: 14.25, y: 14.25, z: 14.25 },
        },
        model: {
            lq: {
                obj: "/public/assets/models/upgtLow/oil-10-model.obj",
                mtl: "/public/assets/models/upgtLow/oil-10-model.mtl",
            },
            mq: {
                obj: "/public/assets/models/upgtMiddle/oil-40-model.obj",
                mtl: "/public/assets/models/upgtMiddle/oil-40-model.mtl",
            },
            hq: {
                obj: "/public/assets/models/upgtObj/model-15.03.20.obj",
                mtl: "/public/assets/models/upgtObj/model-15.03.20.mtl",
            },
        },
    },
    2: {
        // MTR
        se: {
            lat: 59.5653236,
            long: 28.22373564,
        },
        nw: {
            lat: 59.56312877,
            long: 28.22806834,
        },
        properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 0, y: 0, z: 0 },
        },
        model: {
            lq: {
                obj: "",
                mtl: "",
            },
            mq: {
                obj: "",
                mtl: "",
            },
            hq: {
                obj: "",
                mtl: "",
            },
        },
    },
    3: {
        // VZG
        se: {
            lat: 59.57315508,
            long: 28.21247008,
        },
        nw: {
            lat: 59.57155414,
            long: 28.21528442,
        },
        properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 0, y: 0, z: 0 },
        },
        model: {
            lq: {
                obj: "",
                mtl: "",
            },
            mq: {
                obj: "",
                mtl: "",
            },
            hq: {
                obj: "",
                mtl: "",
            },
        },
    },
};

export function getGpsByLineID(lineID) {
    const id = Number(lineID);
    if (id >= 0) {
        switch (id) {
            case 1: return OBJECT_PROPERTIES[1];
            case 44: return OBJECT_PROPERTIES[1];
            case 2: return OBJECT_PROPERTIES[2];
            case 3: return OBJECT_PROPERTIES[3];
            default: return null;
        }
    }
    return false;
}

export const DEFAULT_OBJECT = {
    se: {
        lat: 59.57010476,
        long: 28.23517886,
    },
    nw: {
        lat: 59.5670175,
        long: 28.24540231,
    },
    properties: {
        position: { x: -237.1, y: 2.5, z: 162.45 },
        rotation: { x: -1.575, y: 0, z: 0 },
        scale: { x: 14.25, y: 14.25, z: 14.25 },
    },
    model: {
        lq: {
            obj: "/public/assets/models/upgtLow/oil-10-model.obj",
            mtl: "/public/assets/models/upgtLow/oil-10-model.mtl",
        },
        mq: {
            obj: "/public/assets/models/upgtMiddle/oil-40-model.obj",
            mtl: "/public/assets/models/upgtMiddle/oil-40-model.mtl",
        },
        hq: {
            obj: "/public/assets/models/upgtObj/model-15.03.20.obj",
            mtl: "/public/assets/models/upgtObj/model-15.03.20.mtl",
        },
    },
};

export default null;
