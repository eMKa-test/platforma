import React from "react";
import * as PropTypes from "prop-types";
import { Route, Switch, Redirect } from "react-router-dom";
import { Container } from "reactstrap";

import ErrorBoundary from "common/ErrorBoundary";

import DefaultContentSwitch from "./DefaultContentSwitch";
import DefaultBreadcrumbs from "./DefaultBreadcrumbs";

const DefaultContent = (props) => (
    <React.Fragment>
        <DefaultBreadcrumbs
            appRoutes={props.navConfig}
            {...props} />
        <Container fluid>
            <React.Suspense fallback={<span />}>
                <Switch>
                    {Array.isArray(props.navConfig) && props.navConfig.map((route) => {
                        return (
                            <Route
                                key={route.component}
                                path={route.path}
                                exact={route.exact}
                                render={() => (
                                    <ErrorBoundary>
                                        <DefaultContentSwitch
                                            {...props}
                                            componentName={route.component} />
                                    </ErrorBoundary>
                                )} />
                        )
                    })}
                    <Redirect to="/admin" />
                </Switch>
            </React.Suspense>
        </Container>
    </React.Fragment>
);

DefaultContent.propTypes = {
    navConfig: PropTypes.array,
};

export default DefaultContent;
