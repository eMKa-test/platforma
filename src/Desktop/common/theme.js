import { createMuiTheme } from "@material-ui/core/styles";
import * as param from "./constants";

export const drawerWidth = 261;

const gilroy = {
    fontFamily: "Gilroy, sans-serif",
};

const _theme = createMuiTheme({
    typography: {
        fontFamily: "Gilroy, sans-serif",
        useNextVariants: true,
        fontWeight: "inherit",
        h5: {
            fontFamily: "Gilroy, sans-serif",
            fontWeight: 400,
            fontSize: 24,
        },
        h1: gilroy,
        h2: gilroy,
        h3: gilroy,
        h4: gilroy,
        h6: gilroy,
        button: {
            letterSpacing: 0,
        },
    },
    palette: {
        background: {
            default: "#0f0f0f",
        },
        primary: {
            main: param.darkColor,
        },
        secondary: {
            main: param.goldColor,
        },
    },
    shape: {
        borderRadius: 3,
    },
});

const baseFontElements = [
    "MuiFormLabel.root",
    "MuiInputBase.root",
    "MuiTableCell.head",
    "MuiTableCell.body",
];

const theme = {
    ..._theme,
    overrides: {
        ...baseFontElements.reduce((acc, str) => ({ ...acc, ...expand(str, { fontSize: 14 }) }), {}),
        MuiDialog: {
            scrollPaper: {
                alignItems: "flex-start",
            },
            paper: {
                minWidth: 300,
            },
        },
        MuiTableCell: {
            alignRight: {
                paddingRight: 24,
            },
        },
        MuiDrawer: {
            paper: {
                backgroundColor: "#1f1f27",
            },
        },
        MuiBadge: {
            badge: {
                top: -5,
                right: "50%",
                padding: 0,
            },
        },
        MuiButton: {
            label: {
                textTransform: "initial",
            },
            contained: {
                boxShadow: "none",
                "&:active": {
                    boxShadow: "none",
                },
            },
        },
        MuiTabs: {
            root: {
                marginLeft: 0,
            },
            indicator: {
                height: 3,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                backgroundColor: param.goldColor,
            },
            flexContainer: {
                minHeight: 30,
            },
        },
        MuiTab: {
            root: {
                textTransform: "initial",
                padding: "10px 22px 0",
                minWidth: 0,
                minHeight: param.headerHeight,
                borderRight: `1px solid ${param.goldColor}`,
                letterSpacing: 0.6,
                [_theme.breakpoints.up("md")]: {
                    minWidth: 0,
                },
                transition: "background-color 0.2s, background 0.2s, color 0.2s",
                "&:hover": {
                    backgroundColor: `${param.goldColor}20`,
                },
            },
            selected: {
                backgroundColor: `${param.goldColor}20`,
            },
            disabled: {
                color: "rgba(255, 255, 255, 0.7) !important",
                backgroundColor: "transparent",
                opacity: "0.7 !important",
                background: `repeating-linear-gradient(135deg, #000000, ${param.goldColor}50 10px)`,
            },
            labelContainer: {
                [_theme.breakpoints.up("md")]: {
                    padding: 0,
                },
            },
        },
        MuiIconButton: {
            root: {
                padding: _theme.spacing.unit,
            },
        },
        MuiToggleButtonGroup: {
            root: {
                height: "100%",
                boxShadow: "none",
            },
            selected: {
                boxShadow: "none",
            },
        },
        MuiToggleButton: {
            root: {
                color: "rgba(255, 255, 255, 0.7)",
                height: "100%",
                backgroundColor: "inherit",
                borderRadius: 0,
                background: `#1f1f27`,
                transition: "color 0.2s, background-color 0.2s, background 2s",
            },
            selected: {
                color: `${param.goldColor} !important`,
                background: "#1f1f27",
                backgroundColor: `${param.goldColor}20 !important`,
            },
            disabled: {
                color: "rgba(255, 255, 255, 0.3) !important",
                backgroundColor: "transparent",
                background: `repeating-linear-gradient(135deg, #000000, ${param.goldColor}50 10px)`,
            },
        },
        MuiTooltip: {
            tooltip: {
                borderRadius: 3,
            },
        },
        MuiDivider: {
            root: {
                backgroundColor: param.goldColor,
            },
        },
        MuiList: {
            padding: {
                paddingTop: 0,
                paddingBottom: 0,
            },
        },
        MuiListItemText: {
            root: {
                padding: "0 8px",
                marginLeft: 8,
                borderLeft: "2px dotted transparent",
                transition: "border 0.3s cubic-bezier(0.16, 0.57, 0.68, 0.53)",
            },
            primary: {
                color: "inherit",
                fontSize: "inherit",
            },
        },
        MuiListItemIcon: {
            root: {
                color: "inherit",
                marginRight: 0,
            },
        },
        MuiToolbar: {
            regular: {
                minHeight: 30,
            },
            gutters: {
                paddingLeft: 8,
                paddingRight: 8,
            },
        },
        MuiPaper: {
            root: {
                position: "relative",
            },
        },
    },
    props: {
        MuiTab: {
            disableRipple: false,
        },
        MuiToggleButton: {
            disableRipple: false,
        },
    },
    mixins: {
        ..._theme.mixins,
        toolbar: {
            minHeight: 30,
        },
    },
};

export default theme;

function expand(str, val = {}) {
    return str.split(".").reduceRight((acc, currentValue) => ({ [currentValue]: acc }), val);
}
