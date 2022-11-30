import theme, { drawerWidth } from "../common/theme";
import { asideWidth } from "../common/constants";

const rootStyles = {
    root: {
        width: "100vw",
        display: "flex",
        height: "100vh",
        backgroundColor: "#1f1f27",
    },
    drawer: {
        zIndex: 1,
        [theme.breakpoints.up("sm")]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appContent: {
        width: `calc(100% - ${asideWidth}px)`,
        display: "flex",
        flexDirection: "column",
    },
    videoBackgroundWrapper: {
        width: `calc(100vw - ${asideWidth}px)`,
        height: "100vh",
        overflow: "hidden",
        position: "absolute",
        zIndex: 0,
        top: 0,
        left: asideWidth,
        backgroundColor: "#1F1F27",
    },
    shadow: {
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 1,
        top: 0,
        left: 0,
        boxShadow: "inset 0 0 0 2000px rgba(0,0,0, 0.88)",
    },
    videoBackground: {
        objectFit: "cover",
        objectPosition: "center",
        width: "100%",
        height: "100%",
        zIndex: -1,
    },
};

export default rootStyles;
