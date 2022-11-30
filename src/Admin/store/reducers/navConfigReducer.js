import { LOAD_SUB_NAV, LOAD_NAVIGATION } from "Admin/constants";

const initialState = () => ({
    home: {
        title: "Главная",
        routes: [
            {
                exact: true,
                name: "Компании",
                to: "/admin/companies",
                path: "/admin/companies",
                component: "Companies",
            },
            {
                exact: true,
                name: "Объекты",
                to: "/admin/objects",
                path: "/admin/objects",
                component: "Objects",
            },
            {
                exact: false,
                name: "Пользователи",
                to: "/admin/users",
                path: "/admin/users",
                component: "Users",
            },
            {
                exact: false,
                name: "Метрика",
                to: "/admin/stats",
                path: "/admin/stats",
                component: "Stats",
            },
            {
                exact: false,
                name: "Активность агентов",
                to: "/admin/activity",
                path: "/admin/activity",
                component: "Activity",
            },
            {
                exact: false,
                name: "Конфигурация",
                to: "/admin/config",
                path: "/admin/config",
                component: "Config",
            },
            {
                exact: true,
                path: "/admin/objects/:objectID",
                component: "ObjectEdit",
            },
            {
                exact: false,
                path: "/admin/objects/:objectID/:lineID",
                component: "LineEdit",
            },
        ],
        items: [
            {
                name: "Компании",
                url: "/admin/companies",
                icon: "icon-grid",
            },
            {
                name: "Объекты",
                url: "/admin/objects",
                icon: "icon-grid",
            },
            {
                name: "Пользователи",
                url: "/admin/users",
                icon: "icon-people",
            },
            {
                name: "Последняя активность",
                url: "/admin/activity",
                icon: "icon-clock",
            },
        ],
    },
    current: {
        title: "",
        routes: [],
        items: [],
    },
});

const navConfigReducer = (state = initialState(), action) => {
    switch (action.type) {
        case LOAD_SUB_NAV: {
            const current = {
                ...state.current,
                ...{ routes: state.current.routes.concat(action.subnav) },
            };
            return { ...state, current };
        }
        case LOAD_NAVIGATION:
            return { ...state, current: action.current };
        default:
            return state;
    }
};

export default navConfigReducer;
