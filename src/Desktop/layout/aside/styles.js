import * as param from "../../common/constants";

const navigatorStyles = (_theme) => ({
    categoryHeader: {
        paddingTop: 16,
        paddingBottom: 16,
    },
    categoryHeaderPrimary: {
        color: _theme.palette.common.white,
    },
    item: {
        paddingTop: 8,
        paddingBottom: 8,
    },
    itemObject: {
        paddingTop: 16,
        paddingBottom: 16,
        fontWeight: 600,
        fontFamily: "Gilroy, sans-serif",
        color: "#F7F7F7",
    },
    itemLine: {
        color: "#F7F7F7",
        transition: "color 0.3s, background 0.2s",
    },
    itemLineText: {
        // borderLeft: `2px double ${param.goldColor}`,
    },
    listWrap: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    itemCategory: {
        backgroundColor: "#232f3e",
        boxShadow: "none",
        paddingTop: 16,
        paddingBottom: 16,
    },
    itemActionable: {
        "&:hover": {
            backgroundColor: "rgba(188, 167, 127, 0.1)",
        },
    },
    itemActiveItem: {
        color: "#FFF",
        background: `linear-gradient(-0.12turn, ${param.goldColor}60 15%, rgba(0,0,0,0.22) 45%)`,
    },
    itemPrimary: {
        color: "inherit",
        fontWeight: "inherit",
    },
    divider: {
        marginTop: 0,
        color: param.goldColor,
    },
    iconLines: {
        color: param.goldColor,
        fontSize: 14,
    },
    papperWrapper: {
        display: "flex",
        flexDirection: "column",
        lineHeight: "inherit",
        borderRight: `1px solid ${param.greyBorder}`,
        height: "100vh",
        zIndex: 1,
        overflowX: "hidden",
    },
    asideListObject: {
        borderBottom: `1px solid ${param.greyBorder}`,
        paddingBottom: 24,
    },
    wrapperAsideListObject: {
        height: "100%",
    },
    trackY: {
        background: `${param.goldColor}40 !important`,
        top: "0 !important",
        bottom: "0 !important",
        right: "1px !important",
        height: "100% !important",
        width: "8px !important",
    },
    thumbY: {
        background: `${param.goldColorHigh}40 !important`,
        transition: "background 0.2s",
        "&:hover": {
            background: `${param.goldColorHigh}80 !important`,
        },
        "&:active": {
            background: `${param.goldColorHigh} !important`,
        },
    },
    content: {
        display: "flex !important",
        flexDirection: "column !important",
        justifyContent: "space-between !important",
    },
});

export default navigatorStyles;
