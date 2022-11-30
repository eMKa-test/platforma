import axios from "axios";

const ignoreParams = ["total"];

function queryBuilder(params = {}) {
    if (
        typeof params !== "object"
        || params instanceof Array
        || Object.is(params, null)
        || Object.keys(params).length === 0
    ) {
        return "";
    }
    let query = Object.keys(params).filter((key) => {
        const inIgnored = ignoreParams.includes(key);
        const empty = params[key] === "";
        return !empty && !inIgnored;
    });
    query = query.map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`);
    return `?${query.join("&")}`;
}

const methods = ["post", "put", "get", "delete"];

export function fetchData({ url, method = "get", body = {} }) {
    if (typeof url !== "string" || typeof method !== "string" || !methods.includes(method)) {
        warn({ url, method }, "fetchData error");
        throw new TypeError("UNACCEPTABLE PARAMS");
    }
    return axios[method](url, body).then((res) => {
        if (Object.entries(body).length) {
            debug(JSON.stringify(body), `${method}, ${url}`);
        }
        // debug(res.data.payload, `${method}, ${url}`);
        // console.log(res.data);
        return res.data;
    }).catch((e) => {
        if (e.response && e.response.status >= 400) {
            throw new Error("Проблемы с подключением, повторите запрос.");
        }
    });
}

export function getData({ mainUrl, params = {} }) {
    const url = mainUrl + queryBuilder(params);
    return fetchData({ url, method: "get" });
}

export function postData({ mainUrl, body = {}, params = {} }) {
    return fetchData({
        url: mainUrl + queryBuilder(params),
        method: typeof body.id === "undefined" ? "post" : "put",
        body,
    });
}

export function delData(url) {
    return fetchData({ url, method: "delete" });
}
