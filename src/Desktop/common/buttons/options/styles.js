import { galleryFullscreenButtonRight } from "../../constants";

const optionsBtnStyle = () => ({
    optionsButton: {
        right: galleryFullscreenButtonRight,
        bottom: "1rem",
    },
    optionsButtonSpan: {
        transform: "rotate(90deg)",
        position: "absolute",
        left: "1.3rem",
    },
});

export default optionsBtnStyle;
