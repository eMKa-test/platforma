import axios from "axios";
import isFunction from "lodash/isFunction";

const { CancelToken } = axios;

export function fetchData(args) {
    const {
        url, method = "get", params,
    } = args;
    if (typeof url !== "string" || typeof method !== "string") {
        // eslint-disable-next-line
        warn({ url, method });
        throw new TypeError("UNACCEPTABLE PARAMS");
    }

    let cancel = () => {};
    const options = {
        cancelToken: new CancelToken((c) => {
            cancel = c;
        }),
        baseURL: `${window.location.origin}/`,
        params,
        ...args.options,
    };

    let req;
    switch (method) {
        case "post":
        case "put": {
            req = axios[method](url, args.body, options);
            break;
        }
        case "delete": {
            req = axios.delete(url);
            break;
        }
        default: {
            req = axios.get(url, options);
        }
    }

    const payloadPromise = req.then((res) => res.data).catch(() => null);

    return [payloadPromise, cancel];
}

export function getData(req, cancellable = false) {
    const args = { ...req, method: "get" };
    const [payloadPromise, cancel] = fetchData(args);
    return cancellable ? [payloadPromise, cancel] : payloadPromise;
}

export function postData(req, onUploadProgress) {
    const args = { ...req, method: "post" };
    if (isFunction(onUploadProgress)) {
        if (!args.options) {
            args.options = {};
        }
        args.options.onUploadProgress = onUploadProgress;
    }
    const [payloadPromise] = fetchData(args);
    return payloadPromise;
}

export function putData(req) {
    const args = { ...req, method: "put" };
    const [payloadPromise] = fetchData(args);
    return payloadPromise;
}

export function deleteData(req) {
    const args = { ...req, method: "delete" };
    const [payloadPromise] = fetchData(args);
    return payloadPromise;
}
