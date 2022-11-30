import theme, { drawerWidth } from "../../common/theme";

const clendarStyles = {
    root: {
        display: "flex",
        minHeight: "100vh",
    },
    drawer: {
        [theme.breakpoints.up("sm")]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appContent: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
    calendarWrapper: {
        position: "absolute",
        right: 0,
        top: "calc(100% + 0.5rem)",
        width: 400,
        zIndex: 1,
    }
};

export default clendarStyles;
