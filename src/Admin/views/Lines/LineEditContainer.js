import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getLineByID, putLine } from "Admin/store/actionCreators/linesActions";
import { clearMemory } from "Admin/store/actionCreators/generalActions";

import LineEdit from "./LineEdit";

const mapStateToProps = (storeState, ownProps) => ({
    currentLine: storeState.currentLine,
    ...ownProps,
});

const mapDispatchToProps = dispatch => bindActionCreators({ clearMemory, getLineByID, putLine }, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(LineEdit));
