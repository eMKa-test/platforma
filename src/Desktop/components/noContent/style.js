import { goldColor } from "../../common/constants";

const noContentStyles = () => ({
    noContentWrapper: {
        width: "100%",
        display: "flex",
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        color: goldColor,
    },
    noContentValue: {
        margin: 0,
    },
    noContentBody: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
    },
    noContentTitle: {
        margin: "0.5rem",
    },
    noContentLink: {
        fontWeight: 600,
        fontSize: "1.3rem",
        textDecoration: "underline",
        background: "transparent",
        color: "inherit",
        outline: "none",
        border: "none",
        cursor: "pointer",
        "& :hover": {
            outline: "none",
            border: "none",
        },
    },
    noContentIcon: {
        width: "7rem",
        marginBottom: "0.5rem",
    },
});

export default noContentStyles;
