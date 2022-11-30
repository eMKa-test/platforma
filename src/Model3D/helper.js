import * as TJ from "three";

export function getDomParams(dom, ...outProps) {
    let outResult = {};
    const domParams = dom.getBoundingClientRect();
    if (outProps.length > 0) {
        outProps.forEach((prop) => {
            if (Object.prototype.hasOwnProperty.call(domParams, prop)) {
                outResult[prop] = domParams[prop];
            } else {
                throw new Error(`No property of ${prop}`);
            }
        });
    } else {
        outResult = domParams;
    }
    return outResult || false;
}

export const onError = () => {
    throw Error("Ошибка");
};

export const gridHelper = (
    size = 2000,
    divisions = 50,
    color1 = "#ffffff",
    color2 = 0xffffff,
) => new TJ.GridHelper(size, divisions, color1, color2);

export const cameraHelper = (camera) => {
    if (!camera) {
        return null;
    }
    return new TJ.CameraHelper(camera);
};

export const directionLightHlper = (
    directionLight,
    size = 50,
    color = "#ffffff",
) => new TJ.DirectionalLightHelper(directionLight, size, color);

export function clearOwnProperties(obj) {
    // eslint-disable-next-line no-restricted-syntax
    for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            obj[prop] = undefined;
        }
    }
}

export default null;
