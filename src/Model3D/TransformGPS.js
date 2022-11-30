function toRad(deg) {
    return (deg * Math.PI) / 180;
}

class ConGPS {
    constructor({ lat: lat1, long: long1 }, { lat: lat2, long: long2 }) {
        this.ne = { lat: lat1, long: long1 };
        this.nw = { lat: lat1, long: long2 };
        this.sw = { lat: lat2, long: long2 };
        this.se = { lat: lat2, long: long1 };
        this.center = {
            lat: (lat1 + lat2) / 2,
            long: (long1 + long2) / 2,
        };
        this.width = this.getDistance(this.ne, this.nw);
        this.height = this.getDistance(this.ne, this.se);
        this.coords = {
            se: { x: 0, y: 0 },
            ne: { x: 0, y: this.height },
            nw: { x: this.width, y: this.height },
            sw: { x: this.width, y: 0 },
        };
    }

    getDistance({ lat: lt1, long: lg1 }, { lat: lt2, long: lg2 }) {
        const R = 6371000;
        const lat1 = toRad(lt1);
        const lat2 = toRad(lt2);
        const dLat = toRad(lt2 - lt1);
        const dLon = toRad(lg2 - lg1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    getScreenCoords({ lat, long }) {
        const xMax = this.width;
        const longMax = this.ne.long;
        const xMin = 0;
        const longMin = this.nw.long;
        const kx = (longMax - longMin) / (xMax - xMin);
        const x = (longMax - long) / kx - this.width / 2;
        const yMax = this.height;
        const latMax = this.ne.lat;
        const yMin = 0;
        const latMin = this.se.lat;
        const kz = (latMax - latMin) / (yMax - yMin);
        const z = (latMax - lat) / kz - this.height / 2;
        return { x, z };
    }

    vertexes() {
        return [
            Object.values(this.coords.ne),
            Object.values(this.coords.nw),
            Object.values(this.coords.sw),
            Object.values(this.coords.se),
        ];
    }
}

export { ConGPS };

export default null;
