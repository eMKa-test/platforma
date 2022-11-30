import Events from "events";

class Event extends Events {
    getRotateCoords(...val) {
        this.emit("rotation", ...val);
    }

    getPanMode(val, subScenes, subPanIndex) {
        this.emit("viewMode", val, subScenes, subPanIndex);
    }
}

export default Event;
