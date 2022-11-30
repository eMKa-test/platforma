import { goldColor, passiveTextColor } from "../../common/constants";

const carouselStyles = () => ({
    sliderWrapperContainer: {
        position: "relative",
        height: "100%",
        maxWidth: "100%",
        margin: "0 auto",
    },
    selectButtonItem: {
        cursor: "pointer",
        position: "absolute",
        width: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        top: "50%",
        transform: "translate(0, -50%)",
        padding: 0,
        border: "none",
        outline: "none",
        background: "#00000062",
        color: passiveTextColor,
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
    buttonPreviousItem: {
        left: 0,
    },
    buttonNextItem: {
        right: 0,
    },
    itemContainer: {
        border: "5px solid transparent",
    },
    selectItem: {
        border: `5px solid ${goldColor}`,
    },
    sliderItem: {
        width: "100%",
        height: "100%",
        display: "block",
        userSelect: "none",
        border: "none",
        background: "transparent",
        outline: "none",
        position: "relative",
        padding: 0,
        "&:focus": {
            outline: "none",
        },
        "&:hover div": {
            backgroundColor: "#00000095",
        },
    },
    sliderItemTimelapse: {
        position: "relative",
        color: "#fff",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        userSelect: "none",
        border: "none",
        background: "#000",
        textAlign: "center",
        outline: "none",
        padding: 0,
        "&:focus": {
            outline: "none",
        },
    },
    buttonChangeItemsShow: {
        opacity: 1,
    },
    buttonChangeItemsHide: {
        opacity: 0,
    },
    carouselImage: {
        display: "inline-block",
        width: "57%",
        margin: "0 auto",
    },
    carouselImagePic: {
        display: "inline-block",
        width: "100%",
    },
    carouselDescription: {
        fontFamily: "Gilroy, sans-serif",
        position: "absolute",
        width: "100%",
        bottom: 0,
        color: "white",
        padding: 5,
        overflowWrap: "break-word",
        background: "#0000008c",
    },
    papperRoot: {
        width: "100%",
        position: "absolute",
        backgroundColor: "#00000070",
        padding: 5,
        bottom: 0,
        color: "#ffffff",
        transition: "background 0.2s",
    },
});
export default carouselStyles;
