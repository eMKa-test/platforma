import uniq from "lodash/uniq";

export const collectMarkers = (store, id, extendArray) => {
    if (!extendArray) {
        return !store.includes(id)
            ? store.concat(id)
            : store.filter((item) => item !== id);
    }
    const result = [].concat(extendArray).concat(store);
    return uniq(result);
};

export const getDomCoords = (
    params,
    {
        width, height, x, moveDirX, y, moveDirY,
    },
) => {
    let result = {
        width: `${width}px`,
        height: `${height}px`,
    };
    if (moveDirX === 1) {
        result = {
            ...result,
            left: `${x}px`,
        };
    } else {
        result = {
            ...result,
            right: `${params.width - x}px`,
        };
    }
    if (moveDirY === 1) {
        result = {
            ...result,
            top: `${y}px`,
        };
    } else {
        result = {
            ...result,
            bottom: `${params.height - y}px`,
        };
    }
    return result;
};

export const checkMapDomCoords = (mapClass, pans) => {
    return pans.map((el) => {
        return {
            id: el.id,
            screenCoords: mapClass.leafletElement.latLngToContainerPoint(Object.values(el.gps)),
        };
    });
};

export default null;
