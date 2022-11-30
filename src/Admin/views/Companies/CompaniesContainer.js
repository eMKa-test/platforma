import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import {
    getCompanies,
    putCompanies,
    deleteCompanies,
} from "Admin/store/actionCreators/companiesActions";
import { clearMemory } from "Admin/store/actionCreators/generalActions";

import Companies from "./Companies";

const mapStateToProps = (storeState, ownProps) => ({
    companies: storeState.companies,
    ...ownProps,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getCompanies,
    putCompanies,
    clearMemory,
    deleteCompanies,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Companies);
