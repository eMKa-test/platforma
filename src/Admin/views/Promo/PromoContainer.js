import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {
    putPromo,
    clearPromo,
    deletePromo,
    getPromoByCompaniesID,
} from "Admin/store/actionCreators/promoActions";

import Promo from "./Promo";

const mapStateToProps = (storeState, ownProps) => {
    return {
        currentCompany: storeState.currentCompany,
        promo: storeState.promo,
        ...ownProps,
    };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    putPromo,
    clearPromo,
    deletePromo,
    getPromoByCompaniesID,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(Promo));
