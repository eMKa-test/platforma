import { goldColor, goldColorHigh } from "../../common/constants";

export default () => ({
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
})
