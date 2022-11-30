import {
    goldColor, passiveTextColor, galleryFullscreenButtonRight, goldColorHigh, galleryDark,
} from "../../common/constants";

const galleryJSS = () => ({
    trackY: {
        background: `${goldColor}40 !important`,
        top: "0 !important",
        bottom: "0 !important",
        right: "1px !important",
        height: "100% !important",
        width: "8px !important",
    },
    thumbY: {
        background: `${goldColorHigh}40 !important`,
        transition: "background 0.2s",
        "&:hover": {
            background: `${goldColorHigh}80 !important`,
        },
        "&:active": {
            background: `${goldColorHigh} !important`,
        },
    },
    root: {
        height: "100%",
        overflow: "hidden",
        backgroundColor: "transparent",
        margin: "0 0.25rem 1rem",
    },
    isContent: {
        paddingTop: "4.5rem",
        paddingBottom: "0.5rem",
    },
    isStream: {
        marginTop: "1rem",
        paddingBottom: "1.5rem",
    },
    grid: {
        display: "flex",
        flexWrap: "wrap",
        margin: "-0.5rem 0.25rem",
    },
    item: {
        overflow: "hidden",
        position: "relative",
        zIndex: 1,
        height: "13rem",
        margin: "0.5rem",
        borderRadius: "0.5rem",
        "&:hover $tmbImage": {
            transform: "scale(1.3)",
        },
        "&:hover $gradient": {
            opacity: "0.2",
        },
    },
    gradient: {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "url('/public/assets/gradient.png')",
        willChange: "opacity",
        transition: "opacity 0.7s",
        zIndex: 1,
    },
    tmbWrapper: {
        cursor: "pointer",
    },
    imageLoader: {
        overflow: "hidden",
        height: 1,
        width: 1,
    },
    tmbImage: {
        overflow: "hidden",
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: -1,
        width: "100%",
        height: "100%",
        transition: "opacity 0.5s, transform 0.3s",
        transform: "scale(1)",
        backgroundSize: "cover",
    },
    description: {
        position: "absolute",
        bottom: "1rem",
        left: "1rem",
        color: goldColorHigh,
        fontWeight: 600,
        zIndex: 2,
    },
    fullscreenContent: {
        height: "100vh",
    },
    fullscreenLeftHoverZoneCancel: {
        width: "20%",
        height: "calc(2.5rem + 10px)",
        position: "absolute",
        left: 0,
        bottom: 0,
        zIndex: 2,
    },
    fullscreenRightHoverZoneCancel: {
        width: "20%",
        height: "calc(2.5rem + 10px)",
        position: "absolute",
        right: 0,
        bottom: 0,
        zIndex: 2,
    },
    fullscreenOptionsMenu: {
        position: "absolute",
        height: "2.5rem",
        width: "6.5rem",
        right: galleryFullscreenButtonRight,
        bottom: "1.2rem",
        backgroundColor: `${galleryDark}`,
        color: goldColorHigh,
        borderRadius: "1.25rem",
        display: "inline-flex",
        justifyContent: "flex-end",
        paddingRight: "3.5rem",
        alignItems: "center",
        transition: "width ease 0.3s, padding-right ease 0.3s, visibility ease 0.3s",
        zIndex: 3,
        boxSizing: "border-box",
    },
    visible: {
        visibility: "visible",
        width: "15rem",
    },
    hidden: {
        visibility: "hidden",
        width: "2.5rem",
        paddingRight: 0,
    },
    fullscreenSlideShow: {
        maxWidth: "100%",
        display: "flex",
        alignItems: "center",
    },
    fullscreenSlideShowCount: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "3rem",
    },
    fullscreenVideoControls: {
        flex: "1 1 auto",
        maxWidth: "100%",
        display: "flex",
        alignItems: "center",
    },
    fullscreenOptionsMenuItem: {
        marginRight: "1rem",
        marginLeft: "1rem",
    },
    fullscreenOptionsMenuButton: {
        height: "2.5rem",
        width: "2.5rem",
        backgroundColor: "transparent",
        color: goldColor,
        border: "none",
        borderRadius: "50%",
        cursor: "pointer",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "color 0.2s, background 0.2s",
        fontSize: "1.35rem",
        zIndex: 4,
        "&:hover": {
            color: goldColorHigh,
        },
    },
    fullscreenOptionsMenuTimer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "15rem",
    },
    fullscreenOptionsMenuProgressBar: {
        cursor: "pointer",
    },
    fullscreenOptionsMenuVolumeWrapper: {
        width: "4rem",
    },
    fullscreenOptionsMenuVolume: {
        cursor: "pointer",
    },
    fullscreenDownload: {
        borderRadius: "inherit",
        backgroundColor: "transparent",
    },
    fullscreenOptionsMenuDownloadButton: {
        marginLeft: "0.5rem",
        fontSize: "1.4rem",
    },
    fullscreenOptionsMenuShareButton: {
        marginLeft: "0.5rem",
        fontSize: "1.3rem",
    },
    fullscreenVideoOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "10rem",
        color: goldColorHigh,
        visibility: "hidden",
        opacity: 0,
        transition: "visibility ease 0.3s, opacity ease 0.3s",
    },
    fullscreenVideoOverlayPause: {
        visibility: "visible",
        opacity: 0.7,
    },
    fullscreenContentWrapper: {
        height: "100%",
    },
    fullscreenContentItemWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    fullscreenContentItem: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: "0 auto",
        width: "auto",
        height: "100%",
    },
    fullscreenSliderHoverZone: {
        position: "absolute",
        height: "18.5vh",
        left: 0,
        right: 0,
        bottom: 0,
        willChange: "transform",
        transition: "transform 0.3s",
        color: goldColor,
        zIndex: 1,
        "&:hover": {
            transform: "translateY(0)",
            zIndex: 5,
        },
    },
    hide: {
        transform: "translateY(20vh)",
    },
    reveal: {
        transform: "translateY(calc(18.5vh - 30px))",
    },
    fullscreenBottomPanel: {
        position: "relative",
        height: "30px",
        cursor: "pointer",
        "&:after": {
            content: "''",
            position: "absolute",
            display: "block",
            boxShadow: "0 0 1px 0 rgba(0,0,0, 0.64)",
            width: "60%",
            border: "2px solid #7b6b50",
            top: "50%",
            left: "50%",
            transform: "translateX(-50%) translateY(-50%)",
            borderRadius: "20px",
        },
        "&:before": {
            content: "'⇳'",
            position: "absolute",
            display: "block",
            bottom: 0,
            left: "50%",
            textShadow: "0px 0px 1px rgba(0,0,0, 0.64)",
            fontSize: "1.6rem",
            fontWeight: "bold",
            transform: "translateX(-50%) translateY(-20px)",
        },
    },
    fullscreenSliderImageContainer: {
        cursor: "pointer",
        "&:hover img": {
            transform: "scale(1.2)",
        },
    },
    fullscreenSliderImage: {
        height: "16vh",
        display: "block",
        userSelect: "none",
        border: "none",
        background: "#1A1C23",
        outline: "none",
        position: "relative",
        padding: 0,
        "& img": {
            position: "relative",
            height: "auto",
            width: "100%",
            willChange: "transform",
            transform: "scale(1.0)",
            transition: "transform 0.4s ease",
        },
    },
    fullscreenSelectButtonItem: {
        cursor: "pointer",
        position: "absolute",
        top: 0,
        width: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
        border: "none",
        outline: "none",
        background: "rgba(0,0,0,0.56)",
        color: passiveTextColor,
        height: "100%",
        transition: "color 0.2s, background 0.2s",
        zIndex: 1,
        "&:focus": {
            outline: "none",
        },
        "&:hover": {
            background: `${goldColor}42`,
            color: goldColor,
        },
        "& img": {
            width: 35,
            height: 35,
            display: "block",
        },
    },
    fullscreenButtonPreviousItem: {
        left: 0,
    },
    fullscreenButtonNextItem: {
        right: 0,
    },
    fullscreenContentItemArrow: {
        height: "30%",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
    },
    innerSlider: {
        backgroundColor: "#00000090",
    },
    share: {
        position: "absolute",
        zIndex: 10,
        top: "0.25rem",
        right: "0.25rem",
    },
    fullscreenMainSliderWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    },
    slideEnter: {
        transform: "translateX(100%)",
    },
    slideEnterReverse: {
        transform: "translateX(-100%)",
    },
    slideEnterActive: {
        transform: "translateX(0%)",
        transition: "transform 300ms ease-in-out",
    },
    slideExit: {
        transform: "translateX(0%)",
    },
    slideExitActive: {
        transform: "translateX(-100%)",
        transition: "transform 300ms ease-in-out",
    },
    slideExitActiveReverse: {
        transform: "translateX(100%)",
        transition: "transform 300ms ease-in-out",
    },
    fadeEnter: {
        opacity: 0,
    },
    fadeEnterActive: {
        opacity: 1,
        transition: "opacity 1000ms ease-in-out",
    },
    fadeExit: {
        opacity: 1,
    },
    fadeExitActive: {
        opacity: 0,
        transition: "opacity 1000ms ease-in-out",
    },
    fastFadeEnter: {
        opacity: 0,
    },
    fastFadeEnterActive: {
        opacity: 1,
        transition: "opacity 300ms ease-in-out",
    },
    fastFadeExit: {
        opacity: 1,
    },
    fastFadeExitActive: {
        opacity: 0,
        transition: "opacity 300ms ease-in-out",
    },
});

const styles = {
    railStyle: {
        backgroundColor: "rgba(74,74,74,0.88)",
    },
    trackStyle: {
        backgroundColor: goldColorHigh,
    },
    handleStyle: {
        borderColor: goldColor,
        backgroundColor: goldColorHigh,
    },
};

export { styles };

export default galleryJSS;
