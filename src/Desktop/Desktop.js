import React from "react";
import * as PropTypes from "prop-types";
import get from "lodash/get";
import {
    withRouter,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import Modal from "react-modal";
import { DatesConsumer } from "./providers/Dates";
import { RightsConsumer } from "./providers/Rights";
import { LoaderConsumer } from "./providers/ContentLoader";
import Layout from "./layout";
import Spinner from "./components/spinner";
import {
    OBJECTS_ROUTES,
    CONTENT_ROUTES,
} from "./router/routePaths";

const TabView = React.lazy(() => import("./view/tabView"));
const ObjectsView = React.lazy(() => import("./view/objectsView"));
const NoCompany = React.lazy(() => import("./components/noCompany"));
const PromoMaterial = React.lazy(() => import("./components/promoMaterial"));
const PromoStream = React.lazy(() => import("./components/promoStream"));

Modal.setAppElement("#root");

class Desktop extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    render() {
        const { location } = this.props;
        return (
            <RightsConsumer>
                {(rightParam) => {
                    return (
                        <DatesConsumer>
                            {(dateParams) => (
                                <Layout
                                    {...dateParams}
                                    {...rightParam}>
                                    <React.Fragment>
                                        {rightParam.mainLoader && <Spinner />}
                                        <React.Suspense fallback={<Spinner />}>
                                            <Switch location={location}>
                                                <Route path={OBJECTS_ROUTES}>
                                                    <ObjectsView />
                                                </Route>
                                                <Route path={CONTENT_ROUTES}>
                                                    <LoaderConsumer>
                                                        {
                                                            (loaderParams) => (
                                                                <TabView
                                                                    {...loaderParams}
                                                                    {...dateParams} />
                                                            )
                                                        }
                                                    </LoaderConsumer>
                                                </Route>
                                                <Route path="/:cs/promo/material">
                                                    <PromoMaterial currentCompany={rightParam.currentCompany} />
                                                </Route>
                                                <Route
                                                    path="/:cs/promo/stream"
                                                    render={(routerProps) => (
                                                        <PromoStream
                                                            params={get(routerProps, "match.params", {})}
                                                            currentCompany={rightParam.currentCompany} />
                                                    )} />
                                                <Route path="/objects">
                                                    <NoCompany />
                                                </Route>
                                                <Route
                                                    path="/"
                                                    exact>
                                                    <Redirect to={`${rightParam.currentCompany.slug}/objects`} />
                                                </Route>
                                            </Switch>
                                        </React.Suspense>
                                    </React.Fragment>
                                </Layout>
                            )}
                        </DatesConsumer>
                    );
                }}
            </RightsConsumer>
        );
    }
}

Desktop.propTypes = {
    location: PropTypes.object.isRequired,
    onMount: PropTypes.func.isRequired,
};

export default withRouter(Desktop);
