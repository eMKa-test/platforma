import React from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import RSC from "react-scrollbars-custom";
import LinearLoader from "../../components/linearLoader";
import Logo from "../../components/logo";
import Menu from "./menu";
import styles from "./styles";

const Navigator = function Navigator({
    classes,
    user,
    companies,
    currentCompany,
    changeCompany,
    sideLoader,
    setShowHeader,
    showHeader,
    ...other
}) {
    return (
        <Drawer
            style={{ zIndex: 1, position: "relative" }}
            variant="permanent"
            {...other}>
            <Grid className={classes.papperWrapper}>
                <Logo
                    user={user}
                    companies={companies}
                    currentCompany={currentCompany}
                    changeCompany={changeCompany}
                    setShowHeader={setShowHeader}
                    showHeader={showHeader} />
                <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
                    {sideLoader ? (
                        <LinearLoader />
                    ) : (
                        <div className={classes.wrapperAsideListObject}>
                            <RSC
                                trackYProps={{ className: classes.trackY }}
                                thumbYProps={{ className: classes.thumbY }}>
                                <List className={classes.listWrap}>
                                    <Menu
                                        user={user}
                                        currentCompany={currentCompany} />
                                </List>
                            </RSC>
                        </div>
                    )}
                </div>
            </Grid>
        </Drawer>
    );
};

Navigator.propTypes = {
    classes: PropTypes.object.isRequired,
    currentCompany: PropTypes.object.isRequired,
    companies: PropTypes.array.isRequired,
    changeCompany: PropTypes.func,
    user: PropTypes.object.isRequired,
    sideLoader: PropTypes.bool.isRequired,
    setShowHeader: PropTypes.func.isRequired,
    showHeader: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Navigator);
