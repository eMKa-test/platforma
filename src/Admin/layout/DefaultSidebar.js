import React from "react";
import { Route, Switch } from "react-router-dom";
import {
    AppSidebar, AppSidebarHeader, AppSidebarMinimizer, AppSidebarNav,
} from "@coreui/react";

import ErrorBoundary from "common/ErrorBoundary";


const DefaultSidebar = ({ navConfig }) => {
    return (
        <AppSidebar
            fixed
            display="lg">
            <ErrorBoundary>
                <Switch>
                    <Route
                        path="/admin"
                        exact
                        render={(props) => (
                            <React.Fragment>
                                <AppSidebarHeader>{navConfig.home.title}</AppSidebarHeader>
                                <AppSidebarNav navConfig={navConfig.home} {...props} />
                            </React.Fragment>
                        )} />
                    <Route
                        path="/admin/*"
                        render={(props) => (
                            <React.Fragment>
                                <AppSidebarHeader>
                                    {navConfig.current.title || "Нет доступных переходов"}
                                </AppSidebarHeader>
                                {navConfig.current.items && <AppSidebarNav navConfig={navConfig.current} {...props} />}
                            </React.Fragment>
                        )} />
                </Switch>
            </ErrorBoundary>
            <AppSidebarMinimizer />
        </AppSidebar>
    );
}

export default DefaultSidebar;
