import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getObjectByID, putObject } from "Admin/store/actionCreators/objectsActions";
import { putLine } from "Admin/store/actionCreators/linesActions";
import { clearMemory } from "Admin/store/actionCreators/generalActions";

import ObjectEdit from "./ObjectEdit";

const mapStateToProps = (storeState, ownProps) => {
    return {
        currentObject: storeState.currentObject,
        companies: storeState.companies,
        ...ownProps,
    };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    clearMemory, getObjectByID, putObject, putLine,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(ObjectEdit));
