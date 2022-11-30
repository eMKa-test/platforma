const compassRangeStyles = () => ({
    compassRangeWrapper: {
        position: "absolute",
        bottom: 0,
        height: 23,
        left: 0,
        width: "100%",
    },
    adaptiveRanges: {
        position: "relative",
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    compassRangeItems: {
        display: "flex",
        justifyContent: "center",
        height: "100%",
        width: "4%",
        marginBottom: -5,
    },
    separateRange: {
        display: "block",
        height: "100%",
        color: "#fff",
        fontSize: 22,
        lineHeight: 1,
    },
    northIcon: {
        display: "block",
        height: "100%",
        color: "red",
        fontSize: 22,
        lineHeight: 1,
    },
    southIcon: {
        display: "block",
        height: "100%",
        color: "#fff",
        fontSize: 22,
        lineHeight: 1,
    },
});

export default compassRangeStyles;
