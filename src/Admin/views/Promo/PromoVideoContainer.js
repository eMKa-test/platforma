import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {
    putPromo,
    deletePromo,
} from "Admin/store/actionCreators/promoActions";

import PromoVideo from "./PromoVideo";

const mapDispatchToProps = (dispatch) => bindActionCreators({
    putPromo,
    deletePromo,
}, dispatch);

export default connect(
    null,
    mapDispatchToProps,
)(withRouter(PromoVideo));
