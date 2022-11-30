import uniqueId from "lodash/uniqueId";

function _mapUrl(camera) {
    const serverUrl = "https://video.enforta.ru/embed/v2/?server=";
    return `${serverUrl}100-2x0NBB5UcUhpQR1B6tTmyw&camera=${camera}&width=&height=&lang=ru`;
}

function _getCamsUrl(numCam) {
    return `https://video.enforta.ru/watch/100-2x0NBB5UcUhpQR1B6tTmyw/${numCam}`;
}

const prevCamsKing = [
    {
        id: uniqueId("cam-"),
        name: "Линия 220, камера 1",
        adminName: "Cam01.Platforma",
        src: _mapUrl(196608),
        camUrl: _getCamsUrl(196608),
        gps: { lat: 59.568663, long: 28.241567 },
    }, {
        id: uniqueId("cam-"),
        name: "Линия 220, камера 2",
        adminName: "Cam02.Platforma",
        src: _mapUrl(262144),
        camUrl: _getCamsUrl(262144),
        gps: { lat: 59.568663, long: 28.241567 },
    }, {
        id: uniqueId("cam-"),
        name: "Линия 210, камера 1",
        adminName: "Cam03.Platforma",
        src: _mapUrl(327680),
        camUrl: _getCamsUrl(327680),
        gps: { lat: 59.567634, long: 28.239286 },
    }, {
        id: uniqueId("cam-"),
        name: "Линия 210, камера 2",
        adminName: "Cam04.Platforma",
        src: _mapUrl(393216),
        camUrl: _getCamsUrl(393216),
        gps: { lat: 59.567634, long: 28.239286 },
    }, {
        id: uniqueId("cam-"),
        name: "Линия 110, камера 1",
        adminName: "Camera (10.78.90.66)",
        src: _mapUrl(0),
        camUrl: _getCamsUrl(0),
        gps: { lat: 59.568085, long: 28.238953 },
    }, {
        id: uniqueId("cam-"),
        name: "Линия 110, камера 2",
        adminName: "Camera (10.78.90.67)",
        src: _mapUrl(65536),
        camUrl: _getCamsUrl(65536),
        gps: { lat: 59.568085, long: 28.238953 },
    },
];

function mapUrlKing(camId) {
    const url = `https://video.enforta.ru/embed/v2/?server=100-bikBLcMTyxrD9Th2sgGVaJ&amp;camera=${camId}&amp;width=&amp;height=&amp;lang=ru`;
    return url;
}

function getCamsUrlKing(camId) {
    const url = `https://video.enforta.ru/watch/100-bikBLcMTyxrD9Th2sgGVaJ/${camId}`;
    return url;
}

export const kingCams = [
    {
        id: 1,
        description: "Линия 220, камера 1",
        adminName: "Camera 01.Platforma (10.78.90.210) SPB-OR19528",
        src: mapUrlKing(196608),
        camUrl: getCamsUrlKing(196608),
        gps: { lat: 59.568663, long: 28.241567 },
    }, {
        id: 2,
        description: "Линия 220, камера 2",
        adminName: "Camera 02.Platforma (10.78.90.211) SPB-OR19528",
        src: mapUrlKing(262144),
        camUrl: getCamsUrlKing(262144),
        gps: { lat: 59.568663, long: 28.241567 },
    }, {
        id: 3,
        description: "Линия 110, камера 1",
        adminName: "Camera (10.78.90.68) SPB-OR17187",
        src: mapUrlKing(0),
        camUrl: getCamsUrlKing(0),
        gps: { lat: 59.568085, long: 28.238953 },
    }, {
        id: 4,
        description: "Линия 110, камера 2",
        adminName: "Camera (10.78.90.67) SPB-OR17187",
        src: mapUrlKing(65536),
        camUrl: getCamsUrlKing(65536),
        gps: { lat: 59.568085, long: 28.238953 },
    },
];

function mapUrlTosno(camId) {
    const url = `https://video.enforta.ru/embed/v2/?server=100-voCOfIxKuOGti7l0gFDczb&amp;camera=${camId}&amp;width=&amp;height=&amp;lang=ru`;
    return url;
}

function getCamsUrlTosno(camId) {
    const url = `https://video.enforta.ru/watch/100-voCOfIxKuOGti7l0gFDczb/${camId}`;
    return url;
}

export const tosnoCams = [
    {
        id: 1,
        description: "Camera01",
        adminName: "Camera01 (192.168.0.2)",
        src: mapUrlTosno(0),
        camUrl: getCamsUrlTosno(0),
        gps: null,
    }, {
        id: 2,
        description: "Camera02",
        adminName: "Camera02 (192.168.0.3)",
        src: mapUrlTosno(65536),
        camUrl: getCamsUrlTosno(65536),
        gps: null,
    }, {
        id: 3,
        description: "Camera03",
        adminName: "Camera03 (192.168.0.4)",
        src: mapUrlTosno(131072),
        camUrl: getCamsUrlTosno(131072),
        gps: null,
    }, {
        id: 4,
        description: "Camera04",
        adminName: "Camera04 (192.168.0.5)",
        src: mapUrlTosno(196608),
        camUrl: getCamsUrlTosno(196608),
        gps: null,
    }, {
        id: 5,
        description: "Camera05",
        adminName: "Camera05 (192.168.0.6)",
        src: mapUrlTosno(262144),
        camUrl: getCamsUrlTosno(262144),
        gps: null,
    }, {
        id: 6,
        description: "Camera06",
        adminName: "Camera06 (192.168.0.7)",
        src: mapUrlTosno(327680),
        camUrl: getCamsUrlTosno(327680),
        gps: null,
    }, {
        id: 7,
        description: "Camera07",
        adminName: "Camera07 (192.168.0.8)",
        src: mapUrlTosno(524288),
        camUrl: getCamsUrlTosno(524288),
        gps: null,
    }, {
        id: 8,
        description: "Camera08",
        adminName: "Camera08 (192.168.0.9)",
        src: mapUrlTosno(458752),
        camUrl: getCamsUrlTosno(458752),
        gps: null,
    },
];

export default {
    tosnoCams,
    kingCams,
};
