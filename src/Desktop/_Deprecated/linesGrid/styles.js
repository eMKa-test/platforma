import { goldColor, goldColorHigh } from "../../common/constants";

const linesGridStyles = (theme) => ({
    gridObjectName: {
        color: goldColor,
        width: "100%",
        fontSize: "2.5rem",
        fontWeight: 600,
        margin: "1.2rem 0 1rem -8px",
        lineHeight: 1,
        position: "static",
    },
    gridWrapper: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
    },
    gridList: {
        width: "100%",
        paddingBottom: theme.spacing.unit,
    },
    gridItemHeader: {
        display: "flex",
        alignItems: "flex-end",
        flex: "0 0 25%",
        marginBottom: "4rem",
    },
    gridItemTitle: {
        width: "75%",
        paddingLeft: "1rem",
        fontSize: "1.125rem",
        color: "#fff",
        textShadow: "1px 2px 2px black",
        marginBottom: "-0.375rem",
    },
    gridItemContent: {
        display: "flex",
        alignItems: "flex-start",
        flex: "1 0 30%",
    },
    gridItemTextDecor: {
        width: "25%",
        position: "relative",
        "&:before": {
            content: "''",
            display: "block",
            position: "absolute",
            top: 3,
            right: 0,
            width: "30%",
            height: 2,
            backgroundColor: goldColorHigh,
        },
    },
    gridItemText: {
        width: "75%",
        marginTop: "-0.375rem",
        color: "#ffffff",
        textShadow: "1px 2px 2px #000000",
        fontSize: "0.9375rem",
        paddingLeft: "1rem",
        lineHeight: "1.25rem",
    },
    gridItem: {
        position: "relative",
        zIndex: 2,
        color: "#a6a6a6",
        height: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "center",
        paddingTop: theme.spacing.unit * 6,
        paddingBottom: theme.spacing.unit * 6,
        paddingLeft: theme.spacing.unit * 3,
        paddingRight: theme.spacing.unit * 3,
        transition: "background-color 0.3s",
    },
    gridItemBG: {
        backgroundColor: "#01010150",
        "&:hover": {
            backgroundColor: "#01010100",
        },
    },
    gridItemSimple: {
        backgroundColor: "rgba(0,0,0,0.05)",
        "&:hover": {
            backgroundColor: "rgba(255,255,255,0.05)",
        },
    },
    wrapperBackground: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50%, 50%",
    },
    wrapperBackgroundCover: {
        backgroundSize: "cover",
    },
    wrapperBackgroundFloat: {
        backgroundSize: "50%",
    },
    wrapperBackgroundContain: {
        backgroundSize: "contain",
    },
    itemLink: {
        width: "100%",
        height: "100%",
        display: "block",
        position: "relative",
    },
    gridItemIndex: {
        width: "25%",
        fontSize: "2.25rem",
        fontWeight: 600,
        color: "#ffffff",
        letterSpacing: 2.7,
        borderBottom: `1px solid ${goldColorHigh}`,
    },
});

export default linesGridStyles;
