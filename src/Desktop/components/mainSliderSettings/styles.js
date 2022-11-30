import { goldColor, passiveTextColor } from "../../common/constants";

const mainSliderStyles = () => ({
    selectButtonItem: {
        cursor: "pointer",
        position: "absolute",
        width: 50,
        display: "flex",
        justifyContent: "center",
        padding: 0,
        border: "none",
        outline: "none",
        background: "#00000062",
        color: passiveTextColor,
        top: "50%",
        height: "50%",
        transform: "translate(0, -50%)",
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
            alignSelf: "center",
        },
    },
    buttonPreviousItem: {
        left: 0,
    },
    buttonNextItem: {
        right: 0,
    },
})

export default mainSliderStyles;
