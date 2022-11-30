import { goldColor, passiveTextColor, alternativeBlackColor } from "../../common/constants";

export default () => ({
    modelLayerContainer: {
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        padding: "inherit",
        zIndex: 1,
    },
    modelLayer: {
        position: "relative",
        margin: "4rem 0.5rem 0",
        border: `2px solid ${goldColor}`,
        height: "calc(100% - 4.5rem)",
        zIndex: 0,
        "&:focus": {
            outline: "none",
        },
    },
    closeModelButton: {
        position: "absolute",
        right: 10,
        top: 10,
        cursor: "pointer",
        border: "none",
        outline: "none",
        padding: 5,
        background: "transparent",
        zIndex: 400,
        "& img": {
            display: "block",
            width: 25,
            height: 25,
        },
    },
    modelBox: {
        height: "100%",
        filter: "blur(0)",
        transition: "filter 200ms ease",
        "& canvas": {
            height: "100%",
            display: "block",
            "&:focus": {
                outline: "none",
            },
        },
        "&:focus": {
            outline: "none",
        },
    },
    reloadContent: {
        filter: "blur(3px)",
    },
    reloadQuality: {
        filter: "blur(3px)",
    },
    qualityLoader: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    isContent: {
        paddingTop: "4.5rem",
        paddingBottom: "0.5rem",
    },
    root: {
        height: "100%",
        overflow: "hidden",
        backgroundColor: "transparent",
        margin: "0 0.25rem 1rem",
    },
    fullscreenContentItemWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    fullscreenContentItem: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: "0 auto",
        width: "auto",
        height: "100%",
    },
    fullscreenMainSliderWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    },
    modelQualityTogglerContainer: {
        position: "absolute",
        top: 10,
        left: 10,
    },
    modelQualityButton: {
        display: "inline-block",
        padding: "0.3rem 0.7rem",
        background: "transparent",
        color: "#F7F7F7",
        border: "1px solid black",
        outline: "none",
        width: "3rem",
        cursor: "pointer",
        transition: "color 100ms ease",
        "&:hover": {
            color: goldColor,
        },
    },
    modelQualityButtonSelected: {
        color: goldColor,
        border: `1px solid ${goldColor}`,
        background: alternativeBlackColor,
    },
});
