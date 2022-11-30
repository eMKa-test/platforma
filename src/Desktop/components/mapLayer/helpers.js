export const arrayOrState = (payload, state = []) => {
    if (!(payload instanceof Array)) {
        return state;
    }
    return [...payload];
};

export const objectOrState = (payload, state = {}) => {
    if (typeof payload !== "object" || Object.is(payload, null) || payload instanceof Array) {
        return state;
    }
    return { ...payload };
};

export const substr = (text = "", lim = 200) => {
    if (text.length > lim) {
        return `${text.substr(0, lim)}...`;
    }
    return text;
};

export const substrClever = (text = "") => {
    const limit = Math.round(text.length * 0.2);
    const pass = Math.round(text.length * 0.4);
    const leftPart = text.substr(0, limit);
    const rightPart = text.substr(limit + pass, text.length);
    return `${leftPart}...${rightPart}`;
};

export default {
    arrayOrState,
    objectOrState,
    substr,
    substrClever,
};
