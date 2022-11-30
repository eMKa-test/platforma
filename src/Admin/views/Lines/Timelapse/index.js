import React from "react";
import * as PropTypes from "prop-types";
import TimelapseTab from "./TimelapseTab";

class TimeLapse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <TimelapseTab {...this.props} />
        );
    }
}

export default TimeLapse;
