import {
    START,
    DOWNLOAD,
    VIEWED,
    VIDEO_START, VIDEO_RESUME, VIDEO_EXIT, VIDEO_CHANGE,
    MAP_OPEN, MAP_CHANGE_LOCATION,
    CALENDAR_CHANGE_DATE,
    FULLSCREEN_SCORE,
    PANORAMA_ENTER, PANORAMA_VIEW_CONTENT,
    AEROPANORAMA_SUBLINE_ENTER, AEROPANORAMA_SUBLINE_PAN_STEPS,
    LOGO_CLICK,
    LINE_SELECTION,
    COMPANY_CHANGE,
    LOG_OUT,
    PROMO_MONTH_SELECT,
    SHARE_CLICK, SHARE_VIEW,
    SLIDE_SHOW_VIEW,
} from "../../../../common/Metrika";

const events = {
    START: {
        event: START,
        title: "Вход на сайт",
        description: "Открытие сайта в браузере",
    },
    LOG_OUT: {
        event: LOG_OUT,
        title: "Выход из учетной записи",
        description: "Откуда был совершен выход из учетной записи",
    },
    DOWNLOAD: {
        event: DOWNLOAD,
        title: "Загрузка контента",
        description: "Загрузка файла(фото/видео) на компьютер",
    },
    VIEWED: {
        event: VIEWED,
        title: "Просмотренный контент",
        description: "Просмотренные до конца видео и фото",
    },
    VIDEO_START: {
        event: VIDEO_START,
        title: "Старт проигрывания",
        description: "Начало воспроизведения видео",
    },
    VIDEO_RESUME: {
        event: VIDEO_RESUME,
        title: "Возобновление проигрывания",
        description: "Возобновление воспроизведения видео после паузы",
    },
    VIDEO_EXIT: {
        event: VIDEO_EXIT,
        title: "Выход из видео",
        description: "Последний просмотренный ролик перед переходом на новый таб или выхода из полноэранного режима",
    },
    VIDEO_CHANGE: {
        event: VIDEO_CHANGE,
        title: "Смена видео",
        description: "С какого видео был соершен переход на другое",
    },
    MAP_OPEN: {
        event: MAP_OPEN,
        title: "Открытие карты",
        description: "Открытие выплывающей карты",
    },
    MAP_CHANGE_LOCATION: {
        event: MAP_CHANGE_LOCATION,
        title: "Переход из карты",
        description: "Переход из карты в контент саблайна",
    },
    CALENDAR_CHANGE_DATE: {
        event: CALENDAR_CHANGE_DATE,
        title: "Выбор даты",
        description: "Выбор новой даты в календаре",
    },
    FULLSCREEN_SCORE: {
        event: FULLSCREEN_SCORE,
        title: "Счетчик полноэранного режима",
        description: "Кол-во просмотренного контента перед выходом из полноэкранного режима",
    },
    PANORAMA_ENTER: {
        event: PANORAMA_ENTER,
        title: "Просмотр панорамы",
        description: "Первый вход на панораму",
    },
    PANORAMA_VIEW_CONTENT: {
        event: PANORAMA_VIEW_CONTENT,
        title: "Просмотр контента на панораме",
        description: "Просмотр фото/видео на панораме",
    },
    AEROPANORAMA_SUBLINE_ENTER: {
        event: AEROPANORAMA_SUBLINE_ENTER,
        title: "Вход в зону аэропанорамы",
        description: "Переход в сектор на аэропанораме",
    },
    AEROPANORAMA_SUBLINE_PAN_STEPS: {
        event: AEROPANORAMA_SUBLINE_PAN_STEPS,
        title: "Просмотр панорам зоны аэропанорамы",
        description: "Кол-во просмотренных панорам до возвращения в небо",
    },
    LOGO_CLICK: {
        event: LOGO_CLICK,
        title: "Логотип",
        description: "Переход на начальный экран по нажатию на логотип",
    },
    LINE_SELECTION: {
        event: LINE_SELECTION,
        title: "Переход на другой отрезок",
        description: "Откуда был совершен переход на новый отрезок",
    },
    COMPANY_CHANGE: {
        event: COMPANY_CHANGE,
        title: "Смена компании",
        description: "Смена компании в выплывающем меню",
    },
    PROMO_MONTH_SELECT: {
        event: PROMO_MONTH_SELECT,
        title: "Выбор месяца для промофильтра",
        description: "Фильтрация промоматериалов по выбранному месяцу в указанном фильтре",
    },
    SHARE_CLICK: {
        event: SHARE_CLICK,
        title: "Нажатие кнопки \"поделиться\"",
        description: "Пользователь поделился контентом указанного типа",
    },
    SHARE_VIEW: {
        event: SHARE_VIEW,
        title: "Просмотр расшаренного контента",
        description: "Севершен просмотр контента по ссылке",
    },
    SLIDE_SHOW_VIEW: {
        event: SLIDE_SHOW_VIEW,
        title: "Слайдшоу",
        description: "Просмотр фотогалереи в режиме слайдшоу",
    },
};

export default events;
