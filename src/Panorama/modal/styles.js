import { goldColor, passiveTextColor } from "../../Desktop/common/constants";

const modalPanoramStyles = () => ({
    modalWrapper: {
        width: "100%",
    },
    modalWrapperAdaptive: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
    },
    modalMainContainer: {
        position: "relative",
        width: "100%",
    },
    modalItemContainer: {
        display: "flex",
        marginTop: 25,
        width: "100%",
        justifyContent: "center",
    },
    selectButtonItem: {
        cursor: "pointer",
        position: "absolute",
        width: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
        border: "none",
        outline: "none",
        background: "#00000062",
        color: passiveTextColor,
        top: "50%",
        height: "50%",
        transform: "translate(0, -50%)",
        transition: "color 0.2s, background 0.2s",
        zIndex: 1,
        "&:focus": {
            outline: "none",
        },
        "&:hover": {
            background: `${goldColor}42`,
            color: goldColor,
        },
        "& img": {
            width: 35,
            height: 35,
            display: "block",
        },
    },
    buttonPreviousItem: {
        left: 0,
    },
    buttonNextItem: {
        right: 0,
    },
    wrapperPanoramItems: {
        width: "20%",
        margin: "0 20px",
        opacity: 0.7,
        filter: "grayscale(0.3)",
        transition: "opacity 0.3s",
    },
    itemWrapperBtn: {
        position: "relative",
        display: "block",
        width: "100%",
        height: "100%",
        border: "none",
        outline: "none",
        padding: 0,
        backgroundColor: "transparent",
    },
    activeItem: {
        opacity: 1,
        filter: "grayscale(0)",
    },
    activeFrame: {
        boxShadow: `2px 6px 18px -4px ${goldColor}80`,
    },
    showContentType: {
        position: "absolute",
        width: 40,
        height: 40,
        opacity: 0.8,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
    },
});

export default modalPanoramStyles;
