export const START = "START";
export const LOG_OUT = "LOG_OUT";
export const VIEWED = "VIEWED";
export const CALENDAR_CHANGE_DATE = "CALENDAR_CHANGE_DATE";
export const LINE_SELECTION = "LINE_SELECTION";
export const COMPANY_CHANGE = "COMPANY_CHANGE";
export const SHARE_BY_URL = "SHARE_BY_URL";
export const SHARE_BY_FILE = "SHARE_BY_FILE";

const events = {
    [START]: {
        title: "Запуск приложения",
        description: "Запуск приложения на мобильном устройстве",
    },
    [LOG_OUT]: {
        title: "Выход из учетной записи",
        description: "Выход из учетной записи",
    },
    [VIEWED]: {
        title: "Просмотренный контент",
        description: "Просмотренный контент",
    },
    [CALENDAR_CHANGE_DATE]: {
        title: "Выбор даты",
        description: "Выбор новой даты в календаре",
    },
    [LINE_SELECTION]: {
        title: "Выбор отрезка",
        description: "Страница с контентом отрезка",
    },
    [COMPANY_CHANGE]: {
        title: "Смена компании",
        description: "Смена компании",
    },
    [SHARE_BY_URL]: {
        title: "Поделился ссылкой на контент",
        description: "Поделился ссылкой на контент",
    },
    [SHARE_BY_FILE]: {
        title: "Поделился в виде файла",
        description: "Поделился в виде файла",
    },
};

export default events;
