import { goldColor } from "../../common/constants";

const headerStyles = () => ({
    secondaryBar: {
        position: "absolute",
        top: "0.5rem",
        right: "0.5rem",
        width: "calc(100% - 1rem)",
        zIndex: 10,
        backgroundColor: "transparent",
        // #1A1C23
    },
    secondaryBarChild: {
        display: "flex",
        justifyContent: "space-between",
        left: 0,
        top: 0,
        right: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
    },
    toggleGroup: {
        display: "flex",
        alignItems: "center",
        borderRadius: 0,
        color: "inherit",
        height: "100%",
    },
    toggleBtn: {
        padding: "4px 20px",
        height: "100%",
        background: "#1f1f27 !important",
    },
    headerTabs: {
        flex: "0 0 auto",
        display: "flex",
        height: "100%",
        backgroundColor: "#1A1C23",
        justifyContent: "space-between",
    },
    headerTab: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    headerTabLabel: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
    },
    headerTabText: {
        margin: "1rem",
        color: goldColor,
        fontSize: "1rem",
        fontWeight: "normal",
    },
    headerTabTextDisable: {
        color: "rgba(172, 181, 190, 0.5)",
    },
    appContent: {
        flex: 1,
        display: "flex",
        alignItems: "flex-end",
        flexDirection: "column",
        position: "relative",
        zIndex: 10,
    },
    headerToggleContainer: {
        flex: "0 0 auto",
        display: "flex",
        zIndex: 3,
        justifyContent: "flex-end",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1A1C23",
        position: "relative",
    },
    headerDate: {
        display: "block",
        color: goldColor,
        padding: "4px 20px",
        fontSize: "1rem",
    },
    closeSublineBtn: {
        position: "absolute",
        height: "100%",
        top: 0,
        right: 8,
        boxShadow: "none",
        background: "#1f1f27",
        borderRadius: 0,
    },
    closeSublineBtnValue: {
        lineHeight: "2rem",
        fontSize: "2rem",
    },
    modelLoaderContainer: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
});

export default headerStyles;
