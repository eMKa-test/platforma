import {
    goldColor,
    passiveTextColor,
} from "../../common/constants";

const camerasStyles = () => {
    return {
        videoTabWrapper: {
            width: "100%",
            position: "relative",
            height: "100%",
        },
        videoTabContainer: {
            margin: "0 auto",
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
        },
        mainCameraContentWrapper: {
            position: "relative",
            width: "100%",
            height: "100%",
        },
        adaptiveBox: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            textAlign: "center",
            border: "1px solid black",
        },
        mainContentBox: {
            position: "relative",
            width: "100%",
            height: "100%",
            margin: "0 auto",
            "& video": {
                width: "100%",
                height: "100%",
                objectFit: "cover",
            },
            transition: "opacity 0.3s, visibility 0.3s",
        },
        selectButtonItem: {
            cursor: "pointer",
            alignItems: "center",
            position: "absolute",
            width: 50,
            display: "flex",
            justifyContent: "center",
            height: "50%",
            top: "50%",
            bottom: 0,
            padding: 0,
            border: "none",
            outline: "none",
            background: "#00000062",
            color: passiveTextColor,
            transform: "translateY(-50%)",
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
        progressItemsWrapper: {
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        itemLoader: {
            color: goldColor,
        },
    };
}

export default camerasStyles;
