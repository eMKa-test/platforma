import { goldColor } from "../../common/constants";

const mapLayerStyles = () => ({
    mapLayerContainer: {
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
    mapLayer: {
        margin: "4rem 0.5rem 0",
        border: `2px solid ${goldColor}`,
        height: "calc(100% - 4.5rem)",
        zIndex: 0,
    },
    closeMapButton: {
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
});

export default mapLayerStyles;
