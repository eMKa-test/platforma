export const initialPolygon = {
    title: "Зона Демо",
    coord: {
        pitch: 0.798407346410207,
    },
    size: {
        width: "600px",
        height: "300px",
    },
    rotation: {
        rotateX: "25.8deg",
        rotateY: "1.2deg",
        rotateZ: "-1.7deg",
    },
    translate: {
        translateX: "-20px",
        translateY: "40px",
        translateZ: "80px",
    },
    radius: {
        radius: 1000,
    },
};

export const INPUT_TYPES = ["size", "coord", "rotation", "translate", "radius"];

export const INPUT_PROPERTIES = {
    size: [
        {
            title: "- Высота +",
            type: "height",
            min: 10,
            max: 5000,
            step: 10,
        },
        {
            title: "- Ширина +",
            type: "width",
            min: 10,
            max: 5000,
            step: 10,
        },
    ],
    coord: [
        {
            title: "- Горизонт +",
            type: "yaw",
            min: -Math.PI,
            max: Math.PI,
            step: 0.0005,
        },
        {
            title: "- Вертикаль +",
            type: "pitch",
            min: -Math.PI,
            max: Math.PI,
            step: 0.0005,
        },
    ],
    rotation: [
        {
            title: "- Поворот X +",
            type: "rotateX",
            min: -180,
            max: 180,
            step: 0.05,
        },
        {
            title: "- Поворот Y +",
            type: "rotateY",
            min: -180,
            max: 180,
            step: 0.05,
        },
        {
            title: "- Поворот Z +",
            type: "rotateZ",
            min: -180,
            max: 180,
            step: 0.05,
        },
    ],
    translate: [
        {
            title: "- Сдвиг X +",
            type: "translateX",
            min: -2000,
            max: 2000,
            step: 10,
        },
        {
            title: "- Сдвиг Y +",
            type: "translateY",
            min: -2000,
            max: 2000,
            step: 10,
        },
        {
            title: "- Сдвиг Z +",
            type: "translateZ",
            min: -2000,
            max: 2000,
            step: 10,
        },
    ],
    radius: [
        {
            title: "+ Глубина -",
            type: "radius",
            min: 100,
            max: 2000,
            step: 10,
        },
    ],
};

export const getTypeUnit = (type, value) => {
    switch (type) {
        case "size":
            return `${value}px`;
        case "translate":
            return `${value}px`;
        case "rotation":
            return `${value}deg`;
        default: return value;
    }
};

export const getValueFromType = (type, value) => {
    switch (type) {
        case "size":
            return parseInt(value, 10);
        case "coord" && "rotation":
            return parseFloat(value, 10);
        case "translate":
            return parseInt(value, 10);
        default: return value;
    }
};
