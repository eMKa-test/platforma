import { connect } from "react-redux";

import DefaultHeader from "./DefaultHeader";

// eslint-disable-next-line
const mapStateToProps = (storeState, ownProps) => ({
    companies: storeState.companies,
    routes: storeState.navConfig.home.routes,
    operator: storeState.general.operator,
    ...ownProps,
});

export default connect(mapStateToProps)(DefaultHeader);
