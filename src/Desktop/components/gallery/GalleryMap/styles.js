import { goldColor } from "../../../common/constants";

const styles = () => ({
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
        willChange: "transform",
        transform: "translateX(100%)",
        transition: "transform 300ms ease",
    },
    mapLayerContainerVisible: {
        transform: "translateX(0%)",
    },
    mapLayer: {
        margin: "0 0.5rem",
        border: `2px solid ${goldColor}`,
        height: "100%",
        zIndex: 0,
    },
    popupTmb: {
        height: "7rem",
        width: "auto",
        borderRadius: "10px",
    },
});

export default styles;
