import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { getObjects } from "Admin/store/actionCreators/objectsActions";
import { putLine } from "Admin/store/actionCreators/linesActions";
import { clearMemory } from "Admin/store/actionCreators/generalActions";

import Config from "./Config";

const mapStateToProps = (storeState, ownProps) => ({
    objects: storeState.objects,
    ...ownProps,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ clearMemory, getObjects, putLine }, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Config);
