import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { getObjects, putObject } from "Admin/store/actionCreators/objectsActions";
import { clearMemory } from "Admin/store/actionCreators/generalActions";

import Objects from "./Objects";

const mapStateToProps = (storeState, ownProps) => ({
    objects: storeState.objects,
    companies: storeState.companies,
    ...ownProps,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ clearMemory, getObjects, putObject }, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(Objects));
