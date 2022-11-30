import { goldColor } from "../../common/constants";

const linesGridStyles = {
    gridObjectName: {
        color: goldColor,
        width: "100%",
        fontSize: "2.5rem",
        fontWeight: 600,
        margin: "1.2rem 0 1rem 1rem",
        lineHeight: 1,
    },
    gridList: {
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
    },
    gridItem: {
        flex: "0 0 50%",
        height: "15rem",
        padding: "0.5rem",
    },
    itemLink: {
        width: "100%",
        height: "100%",
        borderRadius: "0.5rem",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#2A2C36",
        transition: "box-shadow 0.2s",
        "&:hover": {
            backgroundColor: "#2A2C36",
            boxShadow: "inset 0 0 0 1000px rgba(55,55,55, 0.5)",
        },
    },
    gridItemHeader: {
        flex: "0 0 58%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "2rem",
    },
    gridItemName: {
        fontSize: "1.1rem",
        color: goldColor,
        fontWeight: 600,
    },
    gridItemDescription: {
        color: goldColor,
        marginTop: "1rem",
        fontWeight: 400,
    },
    gridItemImage: {
        flex: "0 0 42%",
        backgroundSize: "cover",
        backgroundPosition: "center center",
    },
};

export default linesGridStyles;
