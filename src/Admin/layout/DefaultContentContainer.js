import { connect } from "react-redux";

import DefaultContent from "./DefaultContent";

// eslint-disable-next-line
const mapStateToProps = (storeState, ownProps) => {
    const navConfig = storeState.navConfig.home.routes.concat(storeState.navConfig.current.routes).concat({
        exact: true,
        name: "Главная",
        path: "/admin",
        component: "Dashboard",
    });
    return {
        navConfig,
        ...ownProps,
    };
};

export default connect(mapStateToProps)(DefaultContent);
