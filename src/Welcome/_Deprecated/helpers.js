export function handleValidate(str, name) {
    let validInput;
    if (name === "email") {
        const regExp = /.+@.+\..+/gi;
        const validMail = str.match(regExp);
        validInput = validMail && validMail.join("");
    } else {
        validInput = str;
    }
    return validInput;
}

export default {
    handleValidate,
};
