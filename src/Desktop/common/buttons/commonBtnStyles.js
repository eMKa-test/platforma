import { galleryDark, goldColor, goldColorHigh } from "../constants";

const commonBtnStyles = () => ({
    commonButton: {
        position: "absolute",
        height: "3rem",
        width: "3rem",
        backgroundColor: galleryDark,
        color: goldColor,
        border: "none",
        borderRadius: "50%",
        cursor: "pointer",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "color 0.2s, background 0.2s",
        boxShadow: "0 0 2px 2px rgba(0,0,0,1)",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        zIndex: 4,
        "&:hover": {
            color: goldColorHigh,
        },
    },
    commonButtonSpan: {
        fontFamily: "Gilroy, sans-serif",
        fontSize: "3rem",
        lineHeight: "3rem",
        fontWeight: "bold",
    },
});

export default commonBtnStyles;
