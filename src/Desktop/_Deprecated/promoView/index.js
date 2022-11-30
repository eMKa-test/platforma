import React from "react";
import * as PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { compose } from "recompose";
import styles from "./styles";
import bgView from "../../assets/icons/stub.png";
import { controller } from "../../router/routeControl";
import { PROMO_ROUTES } from "../../router/routePaths";
import { WindowSizeConsumer } from "../../providers/WindowSize";

const PromoMaterial = React.lazy(() => import("../../components/promoMaterial"));
const PromoStream = React.lazy(() => import("../../components/promoStream"));

function PromoView(props) {
    const { classes, currentCompany, location } = props;
    const { params } = controller(location, PROMO_ROUTES);
    return (
        <WindowSizeConsumer>
            {({ screenX, screenY }) => (
                <div
                    id="mainTabView"
                    style={{ backgroundImage: `url(${bgView})` }}
                    className={classes.mainPromoViewContainer}>
                    <React.Suspense fallback={<span />}>
                        {params.type === "material" && (
                            <PromoMaterial currentCompany={currentCompany} />
                        )}
                        {params.type === "stream" && (
                            <PromoStream
                                params={params}
                                currentCompany={currentCompany} />
                        )}
                    </React.Suspense>
                </div>
            )}
        </WindowSizeConsumer>
    );
}

PromoView.propTypes = {
    classes: PropTypes.object.isRequired,
    location: PropTypes.shape({}),
    currentCompany: PropTypes.shape({
        id: PropTypes.any,
    }).isRequired,
};

export default compose(
    withRouter,
    withStyles(styles),
)(React.memo(PromoView));
