import {goldColor, passiveTextColor} from "../../common/constants";

const aeroTabStyles = () => ({
    videoTabWrapper: {
        margin: "4rem 0.5rem 0.5rem",
    },
    videoTabContainer: {
    },
    mainContentWrapper: {
        textAlign: "center",
        marginBottom: 10,
    },
    itemsContentWrapper: {
    },
    adaptiveBox: {
        textAlign: "center",
        "& img": {
            width: "100%",
            height: "100%",
            margin: "0 auto",
        },
    },
    mainContentBox: {
        "& video": {
            width: "100%",
            height: "100%",
            objectFit: "fill",
        },
        transition: "opacity 0.3s, visibility 0.3s",
    },
    showContent: {
        opacity: 1,
        visibility: "visible",
    },
    hideContent: {
        opacity: 0,
        visibility: "hidden",
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
    progressItemsWrapper: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    itemLoader: {
        color: goldColor,
    },
});

export default aeroTabStyles;
