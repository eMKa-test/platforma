import { connect } from "react-redux";

import DefaultSidebar from "./DefaultSidebar";

// eslint-disable-next-line
const mapStateToProps = (storeState, ownProps) => ({
    navConfig: storeState.navConfig,
    ...ownProps,
});

export default connect(mapStateToProps)(DefaultSidebar);
