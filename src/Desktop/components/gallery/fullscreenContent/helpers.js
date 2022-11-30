import { CONTENT, GALLERY, SHARE, STREAM, MODEL_3D } from "../../../../constants";
import metrikaEvents from "../../../../common/Metrika";

export const addExtraParams = (contentType) => {
    switch (contentType) {
        case STREAM:
        case CONTENT:
        case SHARE:
        case MODEL_3D:
            return { autoPlay: true };
        default:
            return null;
    }
};

export const sendMetrics = (metricType, src, contentType, mediaType, duration, currentTime) => {
    const args = {
        source: src,
        mediaType,
        contentType,
        duration,
    };
    switch (metricType) {
        case "VIDEO_PAUSE":
        case "VIDEO_CHANGE":
            args.stopTime = Math.floor(currentTime);
            break;
        case "VIDEO_EXIT":
        case "VIDEO_RESUME":
            args.currentTime = Math.floor(currentTime);
            break;
        default:
            break;
    }
    if (mediaType === "VIDEO") {
        args.duration = Math.floor(duration);
    }
    if (contentType === CONTENT) {
        args.tab = GALLERY;
    }
    metrikaEvents.emit(metricType, args);
};

export default {
    addExtraParams,
    sendMetrics,
};
