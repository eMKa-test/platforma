import memoize from "lodash/memoize";

const links = {
    login: {
        name: "Вход",
        link: "login",
        classname: "LoginForm-link",
    },
    register: {
        name: "Регистрация",
        link: "register",
        classname: "RegisterForm-link",
    },
    restore: {
        name: "Забыли пароль?",
        link: "restore",
        classname: "RestoreForm-link",
    },
};

export const modalLinks = {
    login: "Вход",
    register: "Регистрация",
    restore: "Восстановление пароля",
};

export const formFooterLinks = memoize((view) => {
    switch (view) {
        case "login": 
            return [links.register, links.restore];
        case "register": 
            return [links.login];
        case "restore": 
            return [links.login, links.register];
        default:
            return null;
    }
});

export default null;
