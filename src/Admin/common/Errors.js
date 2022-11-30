const Err = (body) => {
    if (body.response) {
        const {
            status, statusText, config, request,
        } = body.response;
        const bodyResErr = {
            status,
            text: statusText,
            params: JSON.parse(config.data),
            url: request.responseURL,
        };
        return bodyResErr;
    }
    const { name, message } = body;
    return {
        name,
        message,
    };
};

export default Err;
