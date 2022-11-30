import React from "react";
import * as PropTypes from "prop-types";
import MenuIcon from "@material-ui/icons/Menu";
import LogoutIcon from "@material-ui/icons/PowerSettingsNew";
import Button from "@material-ui/core/IconButton";
import AdminIcon from "@material-ui/icons/SwapHorizontalCircle";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import metrikaEvents, { LOGO_CLICK, COMPANY_CHANGE, LOG_OUT } from "../../../common/Metrika";
import LogoSVG from "../../../assets/svgJSX/platformaLogo";
import { goldColor, greyBorder, alternativeBlackColor } from "../../common/constants";
import Fade from "@material-ui/core/Fade";

const styles = {
    logoButton: {
        padding: "0 8px",
    },
    logo: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: `1px solid ${greyBorder}`,
        padding: "0 14px 0",
    },
    adminBtn: {
        color: goldColor,
        padding: 0,
        marginTop: 0,
    },
};

const StyledMenu = withStyles({
    paper: {
        backgroundColor: alternativeBlackColor,
        border: `1px solid ${greyBorder}`,
        "&>ul": {
            padding: 0,
        },
    },
})((props) => (
    <Menu
        TransitionComponent={Fade}
        elevation={0}
        {...props} />
));

const StyledMenuItem = withStyles({
    root: {
        color: goldColor,
        "&:not(:first-child)": {
            borderTop: `1px solid ${greyBorder}`,
        },
        "&:first-child": {
            opacity: 1,
            fontWeight: "bold",
        },
    },
})((props) => (
    <MenuItem {...props} />
));


function redirect(location) {
    // eslint-disable-next-line
    return () => (window.location.href = location);
}

const Logo = ({
    user, setShowHeader, companies, changeCompany, currentCompany,
}) => {
    const { email, kind } = user;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const otherUserCompanies = companies.filter((comp) => comp.id !== currentCompany.id);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function onLogoClick() {
        metrikaEvents.emit(
            LOGO_CLICK,
            {
                currentCompanyName: currentCompany.name,
                from: window.location.pathname,
            },
        );
        setShowHeader(false);
    }

    function onCompanyChange(comp) {
        metrikaEvents.emit(
            COMPANY_CHANGE,
            {
                from: currentCompany.name,
                to: comp.name,
            },
            changeCompany(comp.id, handleClose, setShowHeader),
        );
    }

    function onLogout() {
        metrikaEvents.emit(
            LOG_OUT,
            {
                currentCompanyName: currentCompany.name,
                from: window.location.pathname,
            },
            redirect("/logout"),
        );
    }

    return (
        <div style={styles.logo}>
            <Button
                style={styles.logoButton}
                type="button"
                component="button"
                onClick={onLogoClick}>
                <LogoSVG />
            </Button>
            <Button
                style={styles.adminBtn}
                component="button"
                title="меню"
                onClick={handleClick}>
                <MenuIcon />
            </Button>
            <StyledMenu
                classes={{ paper: "sidebar-menu" }}
                id="menu"
                elevation={0}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                <StyledMenuItem
                    disabled>
                    {currentCompany.name}
                    &nbsp;&#183;&nbsp;
                    {email}
                </StyledMenuItem>
                {
                    otherUserCompanies.length > 0 && otherUserCompanies.map((comp) => (
                        <StyledMenuItem
                            key={comp.name}
                            onClick={() => {
                                onCompanyChange(comp);
                            }}>
                            {
                                comp.name
                            }
                        </StyledMenuItem>
                    ))
                }
                <StyledMenuItem onClick={onLogout}>
                    <LogoutIcon />
                    &nbsp;&nbsp;&nbsp;Выйти
                </StyledMenuItem>
                {kind === "SUPER" ? (
                    <StyledMenuItem onClick={redirect("/admin")}>
                        <AdminIcon />
                        &nbsp;&nbsp;&nbsp;Перейти в админку
                    </StyledMenuItem>
                ) : null}
            </StyledMenu>
        </div>
    );
};

Logo.propTypes = {
    user: PropTypes.shape({
        email: PropTypes.string,
        kind: PropTypes.string,
    }),
    setShowHeader: PropTypes.func,
    companies: PropTypes.array,
    changeCompany: PropTypes.func,
    currentCompany: PropTypes.object,
};

export default React.memo(Logo);
