import React from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import SelectIcon from "@material-ui/icons/KeyboardArrowDown";
import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Collapse,
} from "@material-ui/core";
import { goldColor, passiveTextColor } from "../../common/constants";
import style from "./style";

const ListRoot = withStyles({
    root: {
        padding: 0,
    },
})((props) => (
    <List {...props} />
));

const StyledButton = withStyles({
    root: {
        width: "100%",
        color: passiveTextColor,
        height: "inherit",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 8,
        paddingTop: 8,
        paddingLeft: 20,
        fontFamily: "Gilroy, sans-serif",
    },
    selected: {
        fontWeight: 600,
        color: goldColor,
        paddingBottom: 8,
        paddingLeft: 8,
    },
})((props) => (
    <ListItem {...props} />
));

const companyWrapperStyles = {
    textAlign: "center",
    borderBottom: `1px solid ${goldColor}`,
};

const CompanyMenu = ({
    companies, currentCompany, changeCompany, setShowHeader, classes,
}) => {
    const [open, setOpen] = React.useState(false);

    function handleOpen() {
        if (companies.length > 1) {
            setOpen(!open);
        }
    }

    function handleClose() {
        setOpen(false);
    }

    const otherUserCompanies = companies.filter((comp) => comp.id !== currentCompany.id);

    return (
        <div style={companyWrapperStyles}>
            <ListRoot component="nav">
                <StyledButton
                    button
                    selected
                    onClick={handleOpen}>
                    <ListItemText className={classes.companyName}>
                        {
                            currentCompany.name
                        }
                    </ListItemText>
                    <ListItemIcon
                        className={classNames(
                            classes.companyToggler,
                            {
                                [classes.companyToggler__open]: open,
                                [classes.companyToggler__close]: !open,
                            },
                        )}>
                        <SelectIcon />
                    </ListItemIcon>
                </StyledButton>
                <Collapse
                    in={open}
                    timeout="auto"
                    unmountOnExit>
                    <List
                        className={classes.companyDropList}
                        component="div"
                        disablePadding>
                        {
                            otherUserCompanies.map((comp) => (
                                <StyledButton
                                    key={comp.name}
                                    button
                                    onClick={changeCompany(comp.id, handleClose, setShowHeader)}>
                                    {
                                        comp.name
                                    }
                                </StyledButton>
                            ))
                        }
                    </List>
                </Collapse>
            </ListRoot>
        </div>
    );
};

CompanyMenu.propTypes = {
    companies: PropTypes.array,
    classes: PropTypes.object,
    changeCompany: PropTypes.func,
    setShowHeader: PropTypes.func,
    currentCompany: PropTypes.object,
};

export default withStyles(style)(CompanyMenu);
