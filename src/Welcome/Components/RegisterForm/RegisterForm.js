import React from "react";
import * as PropTypes from "prop-types";
import axios from "../../common/Axios";

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            pwd: "",
            confPwd: "",
        };
    }

    handleSubmit = (ev) => {
        ev.preventDefault();
        const {
            name, email, pwd, confPwd,
        } = this.state;
        if (name && email && pwd && confPwd) {
            const validName = name.trim();
            const validEmail = email.trim();
            const validPwd = pwd.trim();
            const validConfPwd = confPwd.trim();
            if (validPwd !== validConfPwd) {
                this.props.setMsg("Пароли не совпадают", false, true);
                return null;
            }
            axios("/user/api/user", {
                name: validName,
                email: validEmail,
                password: validPwd,
            })
                .then(() => {
                    this.setState({
                        name: "",
                        email: "",
                        pwd: "",
                        confPwd: "",
                    });
                    this.props.setMsg("Вам на почту отправлено письмо с подтверждением", true, true);
                })
                .catch((e) => {
                    if (e.response && e.response.status === 400) {
                        this.props.setMsg(
                            "Почта уже зарегистрирована. Если забыли свой пароль, воспользуйтесь формой:",
                            false,
                            true,
                            "restore",
                        );
                        this.props.setUserMail(email);
                    } else {
                        this.props.setMsg("Ошибка регистрации", false, true);
                    }
                    warn(e, "auth error");
                });
        }
        return null;
    };

    handleChange = (name) => ({ target: { value } }) => {
        const { msg } = this.props;
        this.props.setMsg(msg.name, msg.access, false);
        this.setState({
            [name]: value,
        });
    };

    render() {
        const {
            name,
            email,
            pwd,
            confPwd,
        } = this.state;
        return (
            <React.Fragment>
                <form
                    className="RegisterForm"
                    onSubmit={this.handleSubmit}>
                    <div className="RegisterForm-inputs-wrapper">
                        <input
                            required
                            type="text"
                            onChange={this.handleChange("name")}
                            value={name}
                            placeholder="Имя" />
                        <input
                            required
                            type="text"
                            onChange={this.handleChange("email")}
                            value={email}
                            placeholder="Почта" />
                        <input
                            required
                            type="password"
                            onChange={this.handleChange("pwd")}
                            value={pwd}
                            minLength={2}
                            placeholder="Пароль" />
                        <input
                            required
                            type="password"
                            onChange={this.handleChange("confPwd")}
                            value={confPwd}
                            minLength={2}
                            placeholder="Повторно пароль" />
                    </div>
                    <button
                        type="submit">
                        Зарегистрироваться
                    </button>
                </form>
            </React.Fragment>
        );
    }
}

RegisterForm.propTypes = {
    setMsg: PropTypes.func.isRequired,
    setUserMail: PropTypes.func.isRequired,
    msg: PropTypes.shape({
        name: PropTypes.string.isRequired,
        access: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired,
        redirect: PropTypes.string.isRequired,
    }),
};

export default RegisterForm;
