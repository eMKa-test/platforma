import React from "react";
import * as PropTypes from "prop-types";
import Modal from "react-modal";
import ModalMsg from "../Components/ModalMsg";
import FormsView from "../Components/FormsView/FormsView";
import { modalLinks } from "../Components/FormsView/helper";
import { ProvideRegisterDataContext } from "../Components/ProvideRegisterData";

const customStyles = {
    content: {
        zIndex: 20,
        backgroundColor: "#1E1F28",
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "350px",
        maxWidth: "75%",
        padding: "20px",
        overflow: "visible",
        borderRadius: "4px",
    },
};

const LoginView = ({
    modalIsOpen,
    closeModal,
    setOpenForm,
    setMsg,
    openForm,
    msg,

}) => {
    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}>
            <React.Fragment>
                <div className="AuthModal-header">
                    <div className="AuthModal-toggle-buttons">
                        <h3 className="AuthModalHeader-title">
                            {
                                modalLinks[openForm]
                            }
                        </h3>
                    </div>
                    <button
                        type="button"
                        className="AuthModal-close"
                        onClick={closeModal}>
                        &times;
                    </button>
                </div>
                <div className="AuthModal-body">
                    <ProvideRegisterDataContext.Consumer>
                        {
                            (datas) => (
                                <FormsView
                                    {...datas}
                                    msg={msg}
                                    setMsg={setMsg}
                                    setOpenForm={setOpenForm}
                                    openForm={openForm} />
                            )
                        }
                    </ProvideRegisterDataContext.Consumer>
                </div>
                <ModalMsg
                    setOpenForm={setOpenForm}
                    setMsg={setMsg}
                    msg={msg} />
            </React.Fragment>
        </Modal>
    );
};

LoginView.propTypes = {
    modalIsOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    openForm: PropTypes.string.isRequired,
    setMsg: PropTypes.func.isRequired,
    setOpenForm: PropTypes.func.isRequired,
    msg: PropTypes.shape({
        name: PropTypes.string.isRequired,
        access: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired,
        redirect: PropTypes.string.isRequired,
    }),
};

export default LoginView;
