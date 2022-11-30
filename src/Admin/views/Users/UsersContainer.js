import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { getUsers, putUser } from "Admin/store/actionCreators/usersActions";
import { getObjects } from "Admin/store/actionCreators/objectsActions";
import { getCompanies } from "Admin/store/actionCreators/companiesActions";

import Users from "./Users";

const mapStateToProps = (storeState, ownProps) => ({
    users: storeState.users,
    companies: storeState.companies,
    objects: storeState.objects,
    ...ownProps,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getUsers,
    putUser,
    getObjects,
    getCompanies,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Users);
