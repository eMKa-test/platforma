import React from "react";
import * as PropTypes from "prop-types";
import ButtonFooter from "../ButtonFooter";
import LoginForm from "../LoginForm";
import RegisterForm from "../RegisterForm";
import RestoreForm from "../RestoreForm";
import { formFooterLinks } from "./helper";

const FormsView = ({
    openForm,
    setOpenForm,
    ...other
}) => {
    const renderView = () => {
        switch (openForm) {
            case "login":
                return <LoginForm {...other} />;
            case "register":
                return <RegisterForm {...other} />;
            default:
                return <RestoreForm {...other} />;
        }
    };

    const renderFooter = () => (
        formFooterLinks(openForm).map((el) => (
            <ButtonFooter
                key={el.link}
                {...el}
                setOpenForm={setOpenForm} />
        ))
    );

    return (
        <React.Fragment>
            {
                renderView()
            }
            <div className="FormsView-footer">
                {
                    renderFooter()
                }
            </div>
        </React.Fragment>
    );
};

FormsView.propTypes = {
    openForm: PropTypes.string.isRequired,
    setOpenForm: PropTypes.func.isRequired,
};

export default React.memo(FormsView);
