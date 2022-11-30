import React, { Component } from "react";
import * as PropTypes from "prop-types";
import axios from "../../common/Axios";

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        };
    }

    handleSubmit = (ev) => {
        ev.preventDefault();
        axios("/api/login", {
            email: this.state.email,
            password: this.state.password,
        })
            .then((res) => {
                window.location.href = "/";
            })
            .catch((e) => {
                this.props.setMsg("Ошибка входа", false, true);
                warn(e, "login err");
            });
    };

    handleChange = (name) => ({ target: { value = "" } }) => {
        const { msg } = this.props;
        this.setState(
            {
                [name]: value,
            },
            () => this.props.setMsg(msg.name, msg.access, false),
        );
    };

    render() {
        const { email, password } = this.state;
        return (
            <form
                className="LoginForm"
                onSubmit={this.handleSubmit}>
                <div className="LoginForm-inputs-wrapper">
                    <input
                        type="text"
                        onChange={this.handleChange("email")}
                        value={email}
                        placeholder="Логин" />
                    <input
                        required
                        type="password"
                        onChange={this.handleChange("password")}
                        value={password}
                        placeholder="Пароль" />
                </div>
                <button
                    type="submit">
                    Войти
                </button>
            </form>
        );
    }
}

LoginForm.propTypes = {
    setMsg: PropTypes.func.isRequired,
    msg: PropTypes.shape({
        name: PropTypes.string.isRequired,
        access: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired,
        redirect: PropTypes.string.isRequired,
    }),
};

export default LoginForm;
