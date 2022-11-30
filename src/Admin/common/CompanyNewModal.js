import React, { useState, useEffect } from "react";
import * as PropTypes from "prop-types";
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Form,
    FormGroup,
    Input,
    Label,
} from "reactstrap";

const CompanyNewModal = ({
    isOpen,
    defaultName,
    toggleModal,
    submit,
    syncContentType,
}) => {
    const [contentType, setContentType] = useState({ PROMO: false, STREAM: false });

    const handleChange = (name) => ({ target: { checked } }) => {
        setContentType({
            ...contentType,
            [name]: checked,
        });
    };

    useEffect(() => {
        let result = [];
        for (const [key, val] of Object.entries(contentType)) {
            if (val) {
                result.push(key);
            } else {
                result = result.filter((el) => el !== key);
            }
        }
        syncContentType(result);
    }, [contentType]);

    return (
        <Modal
            isOpen={isOpen}
            toggle={toggleModal}
            className="modal-primary">
            <ModalHeader toggle={toggleModal}>
                Создание новой компании
            </ModalHeader>
            <Form onSubmit={submit}>
                <ModalBody>
                    <FormGroup>
                        <Label htmlFor="name">Название</Label>
                        <Input
                            type="text"
                            id="name"
                            defaultValue={defaultName}
                            placeholder="Введите название"
                            required />
                    </FormGroup>
                    <div className="mb-3">
                        <p className="mb-0">
                            Промо материалы:
                        </p>
                        <FormGroup check>
                            <Label check>
                                <Input
                                    checked={contentType.PROMO}
                                    onChange={handleChange("PROMO")}
                                    type="checkbox"
                                    id="promo" />
                                {" "}
                                Контент
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input
                                    checked={contentType.STREAM}
                                    onChange={handleChange("STREAM")}
                                    type="checkbox"
                                    id="stream" />
                                {" "}
                                Стрим
                            </Label>
                        </FormGroup>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        type="submit">
                        Сохранить
                    </Button>
                    {" "}
                    <Button
                        color="secondary"
                        type="button"
                        onClick={toggleModal}>
                        Отмена
                    </Button>
                </ModalFooter>
            </Form>
        </Modal>
    );
};

CompanyNewModal.propTypes = {
    defaultName: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    syncContentType: PropTypes.func.isRequired,
};

export default CompanyNewModal;
