export const OBJECTS_ROUTES = "/:companySlug/objects";

export const CONTENT_ROUTES = "/:companySlug/content";

export const PROMO_ROUTES = [
    "/:companySlug/promo/:type/:contentID",
    "/:companySlug/promo/:type",
];

export const CAMERAS_TABS_ROUTES = [
    "/:companySlug/content/:lineID/cameras/:date/:contentID",
    "/:companySlug/content/:lineID/cameras/:date",
];

export const ALL_MENU_ITEMS_ROUTES = [
    "/:companySlug/:typeView/:lineID/:tab/:date/:contentID",
    "/:companySlug/:typeView/:lineID/:tab/:date",
    "/:companySlug/:typeView/:type/:contentID",
    "/:companySlug/:typeView/:type",
    "/:companySlug/:typeView",
];

export const ALL_MENU_ITEMS_ROUTES_V2 = [
    "/:companySlug/:typeView/:lineID/:tab/:date/:contentID",
    "/:companySlug/:typeView/:lineID/:tab/:date",
    "/:companySlug/:typeView/:lineID/:tab",
    "/:companySlug/:typeView/:type/",
];

export const ASIDE_MENU_ROUTES = [
    "/:companySlug/:typeView/:lineID/:tab",
    "/:companySlug/:typeView/:type",
    "/:companySlug/:typeView",
];

export const PANORAMA_ROUTES = [
    "/:companySlug/content/:lineID/panorama/:date/:contentID",
    "/:companySlug/content/:lineID/panorama/:date",
];

export const AEROPANORAMA_ROUTES = [
    "/:companySlug/content/:lineID/aeropanorama/:date/:contentID",
    "/:companySlug/content/:lineID/aeropanorama/:date",
];

export const AERIAL_ROUTES = [
    "/:companySlug/content/:lineID/aerial/:date/:contentID",
    "/:companySlug/content/:lineID/aerial/:date",
];

export const TIMELAPSE_ROUTES = [
    "/:companySlug/content/:lineID/timelapse/:date/:contentID",
    "/:companySlug/content/:lineID/timelapse/:date",
];

export const MODEL_ROUTE = "/:companySlug/content/:lineID/model";

export const NOMATCH_ROUTES = [
    "/:companySlug/content/:lineID/nomatch/:date/:contentID",
    "/:companySlug/content/:lineID/nomatch/:date",
];

export const NOMATCH_ROUTES_V2 = [
    "/:companySlug/content/:lineID/nomatch/:date/:contentID",
    "/:companySlug/content/:lineID/nomatch/:date",
    "/:companySlug/content/:lineID/nomatch",
];

export const CONTENT_TABS_ROUTES = [
    "/:companySlug/content/:lineID/:tab/:date/:contentID",
    "/:companySlug/content/:lineID/:tab/:date",
];

export const CONTENT_TABS_ROUTES_V2 = [
    "/:companySlug/content/:lineID/:tab/:date/:contentID",
    "/:companySlug/content/:lineID/:tab/:date",
    "/:companySlug/content/:lineID/:tab/",
];
