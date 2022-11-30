import React from "react";
import * as PropTypes from "prop-types";
import {
    Button, Modal, ModalFooter, ModalHeader, Form,
} from "reactstrap";

class DeleteModal extends React.Component {
    del = React.createRef();

    componentDidUpdate() {
        if (this.props.isOpen) {
            const ref = this.del;
            setTimeout(() => ref.current && ref.current.focus(), 100);
        }
    }

    render() {
        const {
            title = "Точно удалить?",
            isOpen,
            toggleModal,
            submit,
        } = this.props;
        return (
            <Modal
                fade={false}
                isOpen={isOpen}
                toggle={toggleModal}
                className="modal-primary">
                <ModalHeader toggle={toggleModal}>{title}</ModalHeader>
                <Form onSubmit={submit}>
                    <ModalFooter>
                        <Button
                            color="primary"
                            type="submit"
                            innerRef={this.del}>
                            Удалить
                        </Button>
                        {" "}
                        <Button
                            color="secondary"
                            type="button"
                            onClick={toggleModal}
                            tabIndex="2">
                            Отмена
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }
}

DeleteModal.propTypes = {
    title: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
};

export default DeleteModal;
