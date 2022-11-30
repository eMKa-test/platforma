import { goldColor } from "../../common/constants";

const objectsGridStyles = () => ({
    root: {
        flexGrow: 1,
        padding: "0.5rem",
        height: "inherit",
        overflowX: "hidden",
        overflowY: "auto",
    },
    progressItemsWrapper: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    itemLoader: {
        backgroundColor: goldColor,
        height: 1,
    },
});

export default objectsGridStyles;
