import React, { useEffect, useState } from "react";
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
    Label, CustomInput,
} from "reactstrap";
import { substr } from "../../utils/helpers";

const ObjectNewModal = ({
    isOpen,
    defaultName,
    defaultDescription,
    defaultLat,
    defaultLong,
    defaultOrderWeight,
    toggleModal,
    submit,
    companies,
    setAccessCompanies,
    currentCompany,
}) => {
    const initState = currentCompany ? [currentCompany.id] : [];
    const [projectCompanies, setprojectCompanies] = useState(initState);
    const [range, setRange] = useState(100);

    const handleChange = (id) => ({ target: { checked } }) => {
        if (checked) {
            const result = [
                ...projectCompanies,
                id,
            ];
            setprojectCompanies(
                result.sort((a, b) => a - b),
            );
        } else {
            setprojectCompanies(projectCompanies.filter((comp) => comp !== id));
        }
    };

    const handleChangeRange = ({ target: { value } }) => {
        setRange(Number(value));
    };

    useEffect(() => {
        setAccessCompanies(projectCompanies);
    }, [projectCompanies]);
    return (
        <Modal
            isOpen={isOpen}
            toggle={toggleModal}
            className="modal-primary">
            <ModalHeader toggle={toggleModal}>
                Создание нового объекта
            </ModalHeader>
            <Form onSubmit={submit}>
                <ModalBody>
                    <p>Принадлежность объекта к компании:</p>
                    <div className="access-checks-container mb-4">
                        {
                            companies.map((el) => (
                                <FormGroup
                                    key={el.id}
                                    className="mb-0 select-access">
                                    <Label
                                        className="mb-0"
                                        style={{
                                            width: "100%",
                                            paddingLeft: "1rem",
                                        }}
                                        htmlFor={`${el.id}checks`}>
                                        {substr(el.name, 30)}
                                    </Label>
                                    <Input
                                        checked={projectCompanies.includes(el.id)}
                                        id={`${el.id}checks`}
                                        type="checkbox"
                                        onChange={handleChange(el.id)} />
                                </FormGroup>
                            ))
                        }
                    </div>
                    <FormGroup>
                        <Label htmlFor="name">Название</Label>
                        <Input
                            type="text"
                            id="name"
                            defaultValue={defaultName}
                            placeholder="Введите название"
                            required />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="description">Описание</Label>
                        <Input
                            type="textarea"
                            id="description"
                            defaultValue={defaultDescription}
                            rows="7"
                            placeholder="Введите описание"
                            required />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="orderWeight">Сортировка</Label>
                        <Input
                            type="number"
                            id="orderWeight"
                            defaultValue={defaultOrderWeight}
                            placeholder="Введите значение сортировки"
                            required />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="description">Широта</Label>
                        <Input
                            type="text"
                            id="lat"
                            defaultValue={defaultLat}
                            placeholder="Введите широту"
                            required />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="description">Долгота</Label>
                        <Input
                            type="text"
                            id="long"
                            defaultValue={defaultLong}
                            placeholder="Введите долготу"
                            required />
                    </FormGroup>
                    <FormGroup>
                        <Label
                            htmlFor="auditRatio"
                            className="mb-0">
                            {
                                `Аудит: ${range}%`
                            }
                        </Label>
                        <CustomInput
                            onChange={handleChangeRange}
                            defaultValue={range}
                            type="range"
                            id="auditRatio"
                            name="auditRatio" />
                    </FormGroup>
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
}

ObjectNewModal.propTypes = {
    defaultName: PropTypes.string,
    companies: PropTypes.array,
    currentCompany: PropTypes.object,
    defaultDescription: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    setAccessCompanies: PropTypes.func,
    defaultLong: PropTypes.number,
    defaultLat: PropTypes.number,
    defaultOrderWeight: PropTypes.number,
};

export default ObjectNewModal;
