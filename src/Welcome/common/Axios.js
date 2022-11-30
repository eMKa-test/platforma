import axios from "axios";

const Axios = (url = "", data = {}) => {
    return axios.post(url, data)
        .then((res) => {
            if (res.data && res.data.success) {
                return res.data;
            }
        });
};

export default Axios;
