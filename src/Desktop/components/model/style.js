export default () => ({
    modelContainer: {
        height: "100%",
        position: "relative",
        background: "#000000",
        zIndex: 1,
    },
    modelBox: {
        height: "100%",
    },
    modeLoader: {
        background: "#000000",
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    modelLoaderOff: {
        opacity: 0,
        visibility: "hidden",
    },
    modelLoaderOn: {
        opacity: 1,
        visibility: "visible",
    },
});
