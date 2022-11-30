import React, { useState, useEffect } from "react";
import * as PropTypes from "prop-types";
import axios from "../../common/Axios";

const RestoreForm = (
    {
        setMsg, msg, mail, setUserMail,
    },
) => {
    const [email, setEmail] = useState("");

    const handleChange = ({ target: { value } }) => {
        setEmail(value);
        setUserMail(value);
        setMsg(msg.name, msg.access, false);
    };

    useEffect(() => {
        if (mail && mail !== email) {
            setEmail(mail);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        axios("/user/api/user/remindPassword", {
            email,
        })
            .then(() => {
                setMsg("Проверьте Вашу почту", true, true);
                setUserMail("");
                setEmail("");
            })
            .catch((e) => {
                if (e.response && e.response.status === 404) {
                    setMsg("Данная почта не зарегистрирована. Пройдите регистрацию", false, true, "register");
                    setUserMail(email);
                } else {
                    setMsg("Ошибка восстановления", false, true);
                }
                warn(e, "restore failed");
            });
    };

    return (
        <React.Fragment>
            <form
                onSubmit={handleSubmit}
                className="RestoreForm">
                <input
                    required
                    type="text"
                    onChange={handleChange}
                    value={email}
                    placeholder="Введите Вашу почту" />
                <button
                    type="submit">
                    Отправить письмо
                </button>
            </form>
        </React.Fragment>
    );
};

RestoreForm.propTypes = {
    setMsg: PropTypes.func.isRequired,
    setUserMail: PropTypes.func.isRequired,
    msg: PropTypes.shape({
        name: PropTypes.string.isRequired,
        access: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired,
        redirect: PropTypes.string.isRequired,
    }),
    mail: PropTypes.string,
};

export default RestoreForm;
