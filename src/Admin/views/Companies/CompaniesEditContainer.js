import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { putCompanies, getCompaniesByID } from "Admin/store/actionCreators/companiesActions";
import { getPromoByCompaniesID } from "Admin/store/actionCreators/promoActions";
import { deleteObject, putObject } from "Admin/store/actionCreators/objectsActions";
import { clearMemory } from "Admin/store/actionCreators/generalActions";

import CompaniesEdit from "./CompaniesEdit";

const mapStateToProps = (storeState, ownProps) => {
    return {
        currentCompany: storeState.currentCompany,
        objects: storeState.objects,
        companies: storeState.companies,
        ...ownProps,
    };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    clearMemory, putCompanies, getCompaniesByID, deleteObject, putObject, getPromoByCompaniesID,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(CompaniesEdit));
