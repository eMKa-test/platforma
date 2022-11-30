const stepBlockStyles = () => ({
    wrapperStepBlock: {
        position: "absolute",
        left: "50%",
        bottom: 70,
        zIndex: 0,
        perspective: 600,
    },
    containerStepBlock: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        perspective: 600,
        position: "relative",
        background: "rgba(0,0,0,0.25)",
    },
    showArrows: {
        opacity: 1,
        visibility: "visible",
    },
    hideArrows: {
        opacity: 0,
        visibility: "hidden",
    },
    adaptiveSteps: {
        position: "relative",
        zIndex: 1,
    },
    wrapperArrow: {
        display: "block",
        position: "absolute",
        border: "none",
        outline: "none",
        padding: 0,
        cursor: "pointer",
        background: "transparent",
        "& img": {
            display: "block",
            width: "100%",
        },
    },
});

export default stepBlockStyles;
