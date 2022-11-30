import { matchPath } from "react-router-dom";

export const getContentController = (pathname = "", path = []) => {
    if (!Array.isArray(path)) {
        return { params: {} };
    }
    return {
        params: {
            companySlug: "",
            typeView: "",
            lineID: "",
            tab: "",
            date: moment().add(-1, "day").format("YYYY-MM-DD"),
            contentID: 0,
        },
        ...matchPath(pathname, { path }),
    };
};

export const controller = ({ pathname }, path) => {
    const promoRoute = pathname.indexOf("promo");
    if (promoRoute >= 0) {
        return Object.assign({
            params: {
                companySlug: "",
                type: "",
                contentID: 0,
            },
        }, matchPath(pathname, { path }));
    }
    return Object.assign({
        params: {
            companySlug: "",
            typeView: "",
            lineID: "",
            tab: "",
            date: moment().add(-1, "day").format("YYYY-MM-DD"),
            contentID: 0,
        },
    }, matchPath(pathname, { path }));
};

export default null;
