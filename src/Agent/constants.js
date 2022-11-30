export const CONTENT_CATEGORY = (object = 0, line = 0) => [
    {
        type: "AERIAL",
        name: "Аэросъёмка",
        accept: "video/*",
        object,
        line,
    },
    {
        type: "IMAGE",
        name: "Фото",
        accept: "image/*",
        object,
        line,
    },
    {
        type: "VIDEO",
        name: "Видео",
        accept: "video/*",
        object,
        line,
    },
    {
        type: "PANORAMA",
        name: "Панорамы",
        accept: "image/*",
        object,
        line,
    },
];

export const technicalLineName = [
    {
        object: 2,
        line: 11,
        alternative: "1-1",
    },
    {
        object: 2,
        line: 14,
        alternative: "1-2",
    },
    {
        object: 2,
        line: 15,
        alternative: "2-1",
    },
    {
        object: 2,
        line: 16,
        alternative: "2-2",
    },
    {
        object: 2,
        line: 17,
        alternative: "3",
    },
    {
        object: 2,
        line: 19,
        alternative: "П2",
    },
    {
        object: 2,
        line: 20,
        alternative: "П3",
    },
];

export const palitter = {
    cleaner: {
        color: "black",
        background: "#eaec4e",
        border: "1px solid black",
    },
    cleanerItem: {
        color: "black",
        border: "1px solid black",
    },
    submit: {
        color: "black",
        background: "#b2f9c1",
        border: "1px solid black",
    },
    resubmit: {
        color: "white",
        background: "#007bffb8",
        border: "1px solid black",
        lineHeight: "15px",
    },
    logout: {
        color: "#fff",
        backgroundColor: "#343a40",
        border: "1px solid",
        borderColor: "#343a40",
    },
    eventblock: {
        color: "white",
        background: "#17a2b8",
        border: "1px solid #17a2b8",
        padding: "5px 8px",
    },
    default: {
        color: "white",
        background: "#17a2b8",
        border: "1px solid #17a2b8",
    },
};

export function setAlternativeName(objectId, lineId) {
    let result = "";
    technicalLineName.forEach((el) => {
        if (el.object === objectId && el.line === lineId) {
            result = ` (${el.alternative})`;
        }
    });
    return result;
}

export const CHUNK_SIZE = 1000000; // 1Mb

export const REPEAT_VAL = 4; // попытки до включения чанков

export const REPEAT_TIME = 1500; // время между попытками

export const EVENT_NAME_SIZE = 1; // кол-во символов для раскрытия ячеек контента событий

export default {
    CONTENT_CATEGORY,
    CHUNK_SIZE,
    REPEAT_VAL,
    REPEAT_TIME,
    EVENT_NAME_SIZE,
    technicalLineName,
    setAlternativeName,
    palitter,
};
