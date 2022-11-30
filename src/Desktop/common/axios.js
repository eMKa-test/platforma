import axios from "axios";
import isEmpty from "lodash/isEmpty";
import memoize from "lodash/memoize";

const { CancelToken } = axios;

/**
 * Массив маршрутов, которые не надо кешировать
 * @type {string[]}
 */
const ignoreUrl = [
    "/user/api/my",
    "/user/api/companies",
    "/user/api/companyContent/1/promo",
];

const isInIgnore = memoize((url) => {
    return ignoreUrl.includes(url);
});

function onError(e) {
    console.error({ e });
    if (e && e.response && Number(e.response.status) === 401) {
        window.location.href = "/";
    }
}

const Axios = (method = "", url = "", params = {}, cancelable = false) => {
    let cancel = () => {
    };
    if (method.toLowerCase() === "post") {
        return axios[method](url, params)
            .then((response) => response.data)
            .catch(onError);
    }

    if (!isInIgnore(url) && isEmpty(params)) {
        const cache = sessionStorage.getItem(url);
        if (!isEmpty(cache)) {
            try {
                const json = JSON.parse(cache);
                if (!isEmpty(json)) {
                    const promise = Promise.resolve(json);
                    if (cancelable) {
                        return [cancel, promise];
                    }
                    return promise;
                }
            } catch (e) {
                // ...
            }
        }
    }

    const promise = axios[method](url, {
        params,
        cancelToken: new CancelToken((c) => {
            cancel = c;
        }),
    })
        .then((response) => {
            const { data } = response;
            if (!isInIgnore(url) && isEmpty(params)) {
                setTimeout(() => {
                    sessionStorage.setItem(url, JSON.stringify(data));
                });
            }
            return response.data;
        })
        .catch((e) => {
            if (!axios.isCancel(e)) {
                onError(e);
            }
        });

    if (cancelable) {
        return [cancel, promise];
    }
    return promise;
};

export default Axios;
