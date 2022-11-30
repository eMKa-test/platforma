import React, { Component } from "react";
import * as PropTypes from "prop-types";
import {
    withRouter, Route, Switch, matchPath,
} from "react-router-dom";
import Modal from "react-modal";
import ProvideData from "../ProvideRegisterData";
import Logo from "../Logo";
import LoginButton from "../LoginButton";
import LoginView from "../../View/LoginView";
import ChangePwdView from "../../View/ChangePwdView";
import { modalLinks } from "../FormsView/helper";

Modal.setAppElement("#root");

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            openForm: "login",
            msg: {
                name: "",
                access: false,
                open: false,
                redirect: "",
            },
        };
    }

    componentDidMount() {
        const { location, history } = this.props;
        const match = matchPath(location.pathname, {
            path: "/:type",
        });
        const emailMatch = location.search.indexOf("email");
        const keyMatch = location.search.indexOf("key");
        if (match && match.params.type === "chgPassword" && keyMatch >= 0 && emailMatch >= 0) {
            this.setState({
                modalIsOpen: true,
            });
        } else if (match && Object.keys(modalLinks).includes(match.params.type)) {
            this.setState({
                modalIsOpen: true,
                openForm: match.params.type,
            });
        } else {
            history.push("/");
        }
    }

    setOpenForm = (val) => () => {
        if (val !== "login") {
            this.props.history.push(val);
        } else {
            this.props.history.push("/");
        }
        this.setMsg("", false, false, "");
        this.setState({
            openForm: val,
        });
    };

    setMsg = (val = "", access = false, open = false, redirect = "") => this.setState({
        msg: {
            name: val,
            access,
            open,
            redirect,
        },
    });

    openModal = () => this.setState({ modalIsOpen: true });

    closeModal = () => {
        this.setState({ modalIsOpen: false, openForm: "login" });
        this.props.history.push("/");
    };

    render() {
        return (
            <ProvideData>
                <div className="Header">
                    <Logo />
                    <LoginButton onClick={this.openModal} />
                    <Switch>
                        <Route path="/chgPassword">
                            <ChangePwdView
                                {...this.state}
                                setOpenForm={this.setOpenForm}
                                closeModal={this.closeModal}
                                setMsg={this.setMsg} />
                        </Route>
                        <Route
                            path={["/", "/register", "/restore"]}>
                            <LoginView
                                {...this.state}
                                setOpenForm={this.setOpenForm}
                                closeModal={this.closeModal}
                                setMsg={this.setMsg} />
                        </Route>
                    </Switch>
                </div>
            </ProvideData>
        );
    }
}

Header.propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(Header);
