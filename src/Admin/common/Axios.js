import axios from "axios";
import Err from "./Errors";

const Axios = (method = "", url = "", data = {}) => {
    if (method.toLowerCase() === "post") {
        return axios[method](url, data)
            .then((response) => {
                if (typeof data !== "string") {
                    if (response.data.success) {
                        return response.data;
                    }
                }
                throw new Error("Не верный POST запрос");
            })
            .catch((e) => {
                const res = Err(e);
                console.error(e);
                throw JSON.stringify(res);
            });
    }
    return axios[method](
        url,
        {
            params: data,
        },
    )
        .then((payload) => {
            if (typeof payload.data !== "string") {
                return payload.data;
            }
            console.log(payload);
            throw new Error("Не верный GET запрос");
        })
        .catch((e) => {
            const res = Err(e);
            console.error(e);
            throw JSON.stringify(res);
        });
};

export default Axios;
