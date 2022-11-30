const styles = () => ({
    placeHolderWrapper: {
        width: "100%",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        willChange: "transform",
        transition: "transform 0.3s",
        overflow: "hidden",
    },
    hidden: {
        transform: "scale(0)",
    },
});

export default styles;
