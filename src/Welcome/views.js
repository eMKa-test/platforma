import uniqueId from "lodash/uniqueId";

import Banner from "./Components/Banner";
import MapView from "./Components/MapView";
import Grid from "./Components/Grid";

import icons from "./assets/icons";
import images from "./assets/images";

const views = [
    {
        id: uniqueId("views-"),
        component: Banner,
        className: "Banner",
        contentClassName: "Banner-container",
    },
    {
        id: uniqueId("views-"),
        component: MapView,
        className: "MapView",
        contentClassName: "",
    },
    {
        id: uniqueId("views-"),
        component: Grid,
        rest: {
            image: images.check,
            icon: icons.check,
            title: "Данные об объектах заказчика доступны 24 часа в сутки 365 дней в году",
            text: `<p>
                Для доступа к ним авторизованному пользователю необходимы лишь доступ в интернет и браузер.
                Для удобства использования, работа с «Платформой» может производиться с помощью мобильных приложений
                для планшетов и смартфонов операционных систем iOS и Android.
            </p>`,
        },
        className: "",
        contentClassName: "View_left",
    },
    {
        id: uniqueId("views-"),
        component: Grid,
        rest: {
            right: true,
            image: images.cloud,
            icon: icons.cloud,
            title: "Все данные в «Платформе» хранятся бессрочно",
            text: `<p>
                Заказчику доступна полная ретроспектива данных по любому объекту за любой промежуток времени.
                Работа с системой возможна с любого современного устройства: настольного компьютера, ноутбука,
                планшета или смартфона. Все данные надежно защищены и доступны только авторизованным пользователям.
            </p>`,
        },
        className: "",
        contentClassName: "View_right",
    },
    {
        id: uniqueId("views-"),
        component: Grid,
        rest: {
            image: images.photo,
            icon: icons.photo,
            title: "В «Платформе» заказчик может накапливать следующие данные о своих объектах",
            text: `<ul>
                <li>Фотографии</li>
                <li>Фотоизображения в формате круговой панорамы</li>
                <li>Видеоролики</li>
                <li>Статистические данные</li>
            </ul>`,
        },
        className: "",
        contentClassName: "View_left",
    },
    {
        id: uniqueId("views-"),
        component: Grid,
        rest: {
            right: true,
            image: images.cloud_1,
            icon: icons.cloud_1,
            title: "«Платформа» — это система cбора, хранения и отображения данных об объектах строительства заказчика",
            text: `<ul>
                <li>Своевременная реакция на изменения в процессе строительства</li>
                <li>Генерация и хранение отчётных материалов по проекту</li>
                <li>Контроль за качеством строительно-монтажных работ</li>
                <li>Беспрерывная передача данных о ходе работ</li>
            </ul>`,
        },
        className: "",
        contentClassName: "View_right",
    },
];

export default views;
