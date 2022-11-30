import React, { Component } from "react";

import Companies from "../Companies";
import Disks from "./Disks";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    render() {
        return (
            <React.Fragment>
                <Companies />
                <div className="admin-dashboard_wrapper mt-3">
                    <Disks />
                </div>
            </React.Fragment>
        );
    }
}

export default Dashboard;
