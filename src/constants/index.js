export const LINES_WITH_CAMS = ["1", "20"];
export const LINES_WITH_TIMELAPSE = ["1", "25"];
export const TABS_WITHOUT_CONTENTID = ["image", "video", "cameras"];

export const MAIN_SLIDE_SPEED = 200;

/**
 * Тип контента для метрики
 * @type {string}
 */
export const MATERIAL = "MATERIAL";
export const STREAM = "STREAM";
export const CONTENT = "CONTENT";
export const SHARE = "SHARE";
export const MODEL_3D = "MODEL_3D";

export const GALLERY = "GALLERY";

export const VIDEO = "VIDEO";

export const MAIN = "MAIN";
export const SLIDE_SHOW = "SLIDE_SHOW";

export const ROUTES_TABS = [
    {
        id: 1,
        tabName: "АЭРО",
        name: "Аэро",
        to: "aeropanorama",
    },
    {
        id: 2,
        tabName: "АЭРОСЪЕМКА",
        name: "Аэросъёмка",
        to: "aerial",
    },
    {
        id: 3,
        tabName: "ТАЙМЛАПС",
        name: "Таймлапс",
        to: "timelapse",
    },
    {
        id: 4,
        tabName: "ПРОСМОТР",
        name: "Просмотр",
        to: "panorama",
    },
    {
        id: 5,
        tabName: "ФОТО",
        name: "Фото",
        to: "image",
    },
    {
        id: 6,
        tabName: "ВИДЕО",
        name: "Видео",
        to: "video",
    },
    {
        id: 7,
        tabName: "КАМЕРЫ",
        name: "Камеры",
        to: "cameras",
    },
    {
        id: 8,
        tabName: "3D",
        name: "3D",
        to: "model",
    },
];

export const ACCESS_TABS = [
    "aerial",
    "timelapse",
    "image",
    "video",
    "cameras",
    "aeropanorama",
];

export const ACCESS_ROUTE_TABS = [
    "aerial",
    "timelapse",
    "image",
    "video",
    "cameras",
    "panorama",
    "aeropanorama",
    "nomatch",
];

export const MODEL_LINES_ACCESS = ["1", "44"];

export const ACCESS_ROUTE_TABS_FOR_MAP = [
    "aerial",
    "timelapse",
    "image",
    "video",
    "cameras",
    "panorama",
];

export const ACCESS_ROUTE_TABS_FOR_MAP_V2 = [
    "aerial",
    "timelapse",
    "cameras",
    "panorama",
];

export const CALENDAR_TABS_ACCESS = [
    "aerial",
    "timelapse",
    "image",
    "video",
    "panorama",
    "aeropanorama",
];

export const PROMO = {
    id: "promo_01",
    name: "ПРОМО",
    links: [
        {
            id: "promo_video_02",
            name: "Видеоматериалы",
            value: "PROMO",
            to: "/promo/material",
            type: "material",
        },
        {
            id: "promo_stream_01",
            name: "Трансляции",
            value: "STREAM",
            to: "/promo/stream",
            type: "stream",
        },
    ],
    contentUrl: (companyID, type) => {
        return type === "stream"
            ? `/user/api/companyContent/${companyID}/streams`
            : `/user/api/companyContent/${companyID}/promo`;
    },
};

export default {
    LINES_WITH_CAMS,
    MAIN_SLIDE_SPEED,
    LINES_WITH_TIMELAPSE,
    ROUTES_TABS,
    PROMO,
};
