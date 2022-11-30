import React, { useState } from "react";
import * as PropTypes from "prop-types";
import { withRouter, useLocation } from "react-router-dom";
import Modal from "react-modal";
import ModalMsg from "../Components/ModalMsg";
import axios from "../common/Axios";
import "./style.css";

const customStyles = {
    content: {
        zIndex: 20,
        backgroundColor: "hsla(0, 0%, 0%, 0.76)",
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "350px",
        maxWidth: "75%",
        padding: "10px 20px 20px 20px",
        height: "300px",
        overflow: "visible",
    },
};

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ChangePwdForm = ({
    modalIsOpen,
    closeModal,
    setMsg,
    msg,
    history,
}) => {
    const [pwd, setPwd] = useState("");
    const [confPwd, setConfPwd] = useState("");

    const query = useQuery();
    const email = query.get("email");
    const key = query.get("key");

    const handleChange = (f) => ({ target: { value } }) => {
        setMsg(msg.name, msg.access, false);
        f(value);
    };

    const closeModalWithRedirect = () => {
        closeModal();
        history.push("/");
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        if (pwd && confPwd && key && email) {
            if (pwd === confPwd) {
                axios("/user/api/user/chgPassword", {
                    email,
                    key,
                    password: pwd,
                })
                    .then(() => {
                        setPwd("");
                        setConfPwd("");
                        setMsg("Успех. Идёт переадресация...", true, true);
                        setTimeout(() => {
                            window.location.href = "/";
                        }, 2000);
                    })
                    .catch((e) => {
                        setMsg("Ошибка", false, true);
                        warn(e, "changePwd error");
                    });
            } else {
                setMsg("Пароли не совпадают", false, true);
            }
        }
    };

    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}>
            <React.Fragment>
                <ModalMsg
                    setMsg={setMsg}
                    msg={msg} />
                <div className="ChangePWD-header">
                    <h3>
                        Восстановление пароля
                    </h3>
                    <button
                        type="button"
                        className="ChangePWD-close"
                        onClick={closeModalWithRedirect}>
                        &times;
                    </button>
                </div>
                <div className="ChangePWD-body">
                    <form
                        className="ChangePWD"
                        onSubmit={handleSubmit}>
                        <div className="ChangePWD-inputs-wrapper">
                            <input
                                autoComplete="false"
                                required
                                type="password"
                                onChange={handleChange(setPwd)}
                                value={pwd}
                                placeholder="Новый пароль" />
                            <input
                                autoComplete="false"
                                required
                                type="password"
                                onChange={handleChange(setConfPwd)}
                                value={confPwd}
                                minLength={2}
                                placeholder="Ещё раз новый пароль" />
                        </div>
                        <button
                            type="submit">
                            Отправить
                        </button>
                    </form>
                </div>
            </React.Fragment>
        </Modal>
    );
};

ChangePwdForm.propTypes = {
    modalIsOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    setMsg: PropTypes.func.isRequired,
    msg: PropTypes.shape({
        name: PropTypes.string.isRequired,
        access: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired,
        redirect: PropTypes.string.isRequired,
    }),
    history: PropTypes.object.isRequired,
};

export default withRouter(ChangePwdForm);
