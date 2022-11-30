import classNames from "classnames";
import * as PropTypes from "prop-types";
import React from "react";
import "./style.css";
import { modalLinks } from "../FormsView/helper";

const ModalMsg = (
    {
        msg: {
            name, access, open, redirect,
        },
        setMsg,
        setOpenForm,
    },
) => {
    return (
        <div
            className={classNames(
                "Modal-message-wrapper",
                {
                    "Modal-message_show": open,
                    "Modal-message_hide": !open,
                    "Modal-message_error": !access,
                },
            )}>
            <button
                type="button"
                onClick={() => setMsg(name, false)}
                className="Modal-message__close-btn">
                &times;
            </button>
            <p>
                {
                    name
                }
            </p>
            {
                redirect && (
                    <button
                        type="button"
                        onClick={setOpenForm(redirect)}
                        className="Modal-message__redirect-link">
                        {
                            modalLinks[redirect]
                        }
                    </button>
                )
            }
        </div>
    );
}

ModalMsg.propTypes = {
    msg: PropTypes.shape({
        name: PropTypes.string.isRequired,
        access: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired,
        redirect: PropTypes.string.isRequired,
    }),
    setMsg: PropTypes.func.isRequired,
    setOpenForm: PropTypes.func,
};

export default ModalMsg;
