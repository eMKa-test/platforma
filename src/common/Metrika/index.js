import EventEmitter from "events";
import axios from "axios";

/*
апи:
    [post] - /user/api/siteEvents/
модель:
    "event": String название события
    "meta": String мета данные, при необходимости
meta:
    вьюха в которой просмотрена картинка,
    На каком времени прекращен просмотр видео,
    ...
 */

/*
Экспорт констант возможных событий
--------------------
Вход на сайт
Просмотр файла (изображение, видео первый кадр, панорама первое открытие) Из какого интерфейса совершен просмотр
Старт видео
Остановка/выход из видео (метка времени видео в момент выхода)
Аэропанорама (переход в сектор)
Аэропанорама (сколько панорам прошел до возвращения в небо)
Панорамы (первый вход на панораму)
Панорамы (просмотр контента из панорамы)
Загрузка файла на компьютер
Открытие карты
Переход из карты в контент (тип контента (вкладка))
Переход на дату из календаря (тип контента (вкладка))
--------------------
*/

/**
 * Вход на сайт
 * @type {string}
 */
export const START = "START";

/**
 * Загрузка файла на компьютер через интерфейс, контекст браузера не записываем (для него будет beforeunload)
 * @type {string}
 */
export const DOWNLOAD = "DOWNLOAD";

/**
 * Просмотр файла (полностью загруженное изображение, видео до конца), из какого интерфейса совершен просмотр
 * @type {string}
 */
export const VIEWED = "VIEWED";

/**
 * Первичное воспроизведение видео
 * @type {string}
 */
export const VIDEO_START = "VIDEO_START";

/**
 * Приостановка воспроизведения видео
 * @type {string}
 */
export const VIDEO_PAUSE = "VIDEO_PAUSE";

/**
 * Возобновление воспроизведения видео после паузы
 * @type {string}
 */
export const VIDEO_RESUME = "VIDEO_RESUME";

/**
 * Выход из просмотра видео
 * @type {string}
 */
export const VIDEO_EXIT = "VIDEO_EXIT";

/**
 * Переход с одного видео на другое
 * @type {string}
 */
export const VIDEO_CHANGE = "VIDEO_CHANGE";

/**
 * Открытие карты
 * @type {string}
 */
export const MAP_OPEN = "MAP_OPEN";

/**
 * Переход из карты в контент
 * @type {string}
 */
export const MAP_CHANGE_LOCATION = "MAP_CHANGE_LOCATION";

/**
 * Переход на дату из календаря в контент
 * @type {string}
 */
export const CALENDAR_CHANGE_DATE = "CALENDAR_CHANGE_DATE";

/**
 * Кол-во просмотренного контента перед выходом из полноэкранного режима
 * @type {string}
 */
export const FULLSCREEN_SCORE = "FULLSCREEN_SCORE";

/**
 *  Панорамы (первый вход на панораму)
 * @type {string}
 */
export const PANORAMA_ENTER = "PANORAMA_ENTER";

/**
 *  Панорамы (просмотр контента из панорамы)
 * @type {string}
 */
export const PANORAMA_VIEW_CONTENT = "PANORAMA_VIEW_CONTENT";

/**
 *  Аэропанорама (переход в сектор)
 * @type {string}
 */
export const AEROPANORAMA_SUBLINE_ENTER = "AEROPANORAMA_SUBLINE_ENTER";

/**
 *  Аэропанорама (сколько панорам прошел до возвращения в небо)
 * @type {string}
 */
export const AEROPANORAMA_SUBLINE_PAN_STEPS = "AEROPANORAMA_SUBLINE_PAN_STEPS";

/**
 * Переход на начальный экран по нажатию на логотип
 * @type {string}
 */
export const LOGO_CLICK = "LOGO_CLICK";

/**
 * Переход на другой отрезок
 * @type {string}
 */
export const LINE_SELECTION = "LINE_SELECTION";

/**
 * Смена компании в меню
 * @type {string}
 */
export const COMPANY_CHANGE = "COMPANY_CHANGE";

/**
 * Выход из учетной записи
 * @type {string}
 */
export const LOG_OUT = "LOG_OUT";

/**
 * Нажатие кнопки поделиться
 * @type {string}
 */
export const SHARE_CLICK = "SHARE_CLICK";

/**
 * Просмотр расшаренного контента
 * @type {string}
 */
export const SHARE_VIEW = "SHARE_VIEW";

/**
 * Выбор месяца для промофильтра
 * @type {string}
 */
export const PROMO_MONTH_SELECT = "PROMO_MONTH_SELECT";

/**
 * Просмотр фотогалереи в режиме слайдшоу
 * @type {string}
 */
export const SLIDE_SHOW_VIEW = "SLIDE_SHOW_VIEW";

const metrikaEvents = new EventEmitter();

metrikaEvents.setMaxListeners(24);

function resolve(cb) {
    return () => {
        if (typeof cb === "function") {
            cb();
        }
    };
}

[
    START,
    DOWNLOAD,
    VIEWED,
    VIDEO_START,
    VIDEO_PAUSE,
    VIDEO_RESUME,
    VIDEO_EXIT,
    VIDEO_CHANGE,
    MAP_OPEN,
    MAP_CHANGE_LOCATION,
    CALENDAR_CHANGE_DATE,
    FULLSCREEN_SCORE,
    PANORAMA_ENTER,
    PANORAMA_VIEW_CONTENT,
    AEROPANORAMA_SUBLINE_ENTER,
    AEROPANORAMA_SUBLINE_PAN_STEPS,
    LOGO_CLICK,
    LINE_SELECTION,
    COMPANY_CHANGE,
    LOG_OUT,
    SHARE_CLICK,
    SHARE_VIEW,
    PROMO_MONTH_SELECT,
    SLIDE_SHOW_VIEW,
].forEach((eventName) => {
    metrikaEvents.on(eventName, (meta, cb) => {
        axios.post("/user/api/siteEvents", {
            event: eventName,
            meta,
        }).then(resolve(cb)).catch(resolve(cb));
    });
});

export default metrikaEvents;
