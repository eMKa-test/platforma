import { goldColor, passiveTextColor } from "../../../common/constants";

const styles = () => ({
    sliderWrapper: {
        padding: "0.5rem",
    },
    titleWrapper: {
        color: goldColor,
        width: "100%",
        margin: "1.2rem 0 1rem 1rem",
        display: "flex",
        alignItems: "center",
    },
    title: {
        fontSize: "2.5rem",
        fontWeight: 600,
        lineHeight: 1,
        marginRight: "1.5rem",
    },
    sliderArrow: {
        cursor: "pointer",
        position: "absolute",
        top: "calc(50% - 3rem)",
        width: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
        border: "none",
        outline: "none",
        background: "rgba(0,0,0,0.56)",
        color: passiveTextColor,
        height: "6rem",
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
    sliderArrowLeft: {
        left: 0,
    },
    sliderArrowRight: {
        right: 0,
    },
    innerSlider: {
        backgroundColor: "transparent",
    },
    sliderImageContainer: {
        cursor: "pointer",
        "&:hover img": {
            transform: "scale(1.2)",
        },
    },
});

export default styles;
