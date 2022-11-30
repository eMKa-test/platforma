import PhotoTab from "./views/Lines/Photo";
import VideoTab from "./views/Lines/Video";
import PanoramaTab from "./views/Lines/Panorama";
import AerialTab from "./views/Lines/Aerial";
import TimelapseTab from "./views/Lines/Timelapse";
import AeroPanoramaTab from "./views/Lines/AeroPanorama";

export const ADMIN_LINES_TABS = [
    {
        name: "Фото",
        to: "image",
        component: PhotoTab,
    },
    {
        name: "Видео",
        to: "video",
        component: VideoTab,
    },
    {
        name: "Панорамы",
        to: "panorama",
        component: PanoramaTab,
    },
    {
        name: "Аэросъемка",
        to: "aerial",
        component: AerialTab,
    },
    {
        name: "Таймлапс",
        to: "timelapse",
        component: TimelapseTab,
    },
    {
        name: "Аэропанорамы",
        to: "aeropanorama",
        component: AeroPanoramaTab,
    },
];

export const CLIENT_TABS = [
    {
        id: 1,
        uuid: "1_aerial",
        value: "aerial",
        name: "Аэро",
    },
    {
        id: 2,
        uuid: "2_timelapse",
        value: "timelapse",
        name: "Таймлапс",
    },
    {
        id: 3,
        uuid: "3_panorama",
        value: "panorama",
        name: "Просмотр",
    },
    {
        id: 4,
        uuid: "4_image",
        value: "image",
        name: "Фото",
    },
    {
        id: 5,
        uuid: "5_video",
        value: "video",
        name: "Видео",
    },
    {
        id: 6,
        uuid: "6_cameras",
        value: "cameras",
        name: "Камеры",
    },
];

export const PROJECTS_WITH_CAMS = [
    {
        projectId: 1,
        lines: ["1"],
    },
    {
        projectId: 2,
        lines: ["20"],
    },
];

export const PROJECTS_WITH_TIMELAPSE = [
    {
        projectId: 1,
        lines: ["1"],
    },
    {
        projectId: 6,
        lines: ["25", "26"],
    },
];

export const LINES_WITH_TIMELAPSE = ["1", "25", "26"];

export default {
    CLIENT_TABS,
    PROJECTS_WITH_CAMS,
    PROJECTS_WITH_TIMELAPSE
};
