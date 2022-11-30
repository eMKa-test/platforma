import React, { Fragment, Component } from "react";
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
import SpinFroLoad from "../components/Spinner";

class EditModal extends Component {
    static defaultProps = {
        title: "Создание нового элемента",
        defaultName: "",
        defaultDescription: "",
        defaultLat: null,
        defaultLong: null,
        defaultDateFrom: "",
        withName: true,
        edit: false,
    }

    state = {
        loadIs: false,
        reFetch: false,
    }

    componentDidUpdate() {
        if (this.props.loadIs !== "undefined" && this.state.loadIs !== this.props.loadIs) {
            this.changeStatus(this.props.loadIs);
        }
        if (this.props.reFetch !== "undefined" && this.state.reFetch !== this.props.reFetch) {
            this.reFetchMode(this.props.reFetch);
        }
    }

    changeStatus = (val) => this.setState({ loadIs: val });

    reFetchMode = (val) => this.setState({ reFetch: val });

    render() {
        const {
            defaultName,
            defaultDescription,
            defaultLat,
            defaultLong,
            defaultDateFrom,
            withName,
            edit,
            title,
            isOpen,
            toggleModal,
            submit,
            cutVideos,
            stylesForAerial,
        } = this.props;
        const { loadIs, reFetch } = this.state;
        return (
            <Modal
                fade={false}
                style={stylesForAerial || {}}
                isOpen={isOpen}
                toggle={loadIs ? null : toggleModal}
                className="modal-primary">
                <ModalHeader toggle={toggleModal}>{title}</ModalHeader>
                <Form onSubmit={submit}>
                    <ModalBody>
                        {cutVideos}
                        {withName && (
                            <FormGroup>
                                <Label htmlFor="name">Название</Label>
                                <Input
                                    type="text"
                                    id="name"
                                    defaultValue={defaultName}
                                    placeholder="Введите название"
                                    required
                                />
                            </FormGroup>
                        )}
                        <FormGroup>
                            <Label htmlFor="description">Описание</Label>
                            <Input
                                type="textarea"
                                id="description"
                                defaultValue={defaultDescription}
                                rows="3"
                                placeholder="Введите описание"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="dateFrom">Дата</Label>
                            <Input
                                type="date"
                                id="dateFrom"
                                defaultValue={defaultDateFrom}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="description">Широта</Label>
                            <Input
                                type="text"
                                id="lat"
                                defaultValue={defaultLat}
                                placeholder="Введите широту"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="description">Долгота</Label>
                            <Input
                                type="text"
                                id="long"
                                defaultValue={defaultLong}
                                placeholder="Введите долготу"
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        {loadIs && (
                            <Button color="light" type="button" disabled>
                                <SpinFroLoad />
                            </Button>)
                        }
                        {!loadIs && !reFetch && (
                            <Fragment>
                                <Button color="success" type="submit">
                                    {edit ? "Сохранить" : "Создать"}
                                </Button>
                                {" "}
                                <Button color="secondary" type="button" onClick={toggleModal}>
                                    Отмена
                                </Button>
                            </Fragment>
                        )}
                        {reFetch && (
                            <Button color="success" type="submit">
                                Повторить
                            </Button>)
                        }
                    </ModalFooter>
                </Form>
                {loadIs && <div className="load-wrapper" />}
            </Modal>
        );
    }
}

EditModal.propTypes = {
    title: PropTypes.string,
    defaultName: PropTypes.string,
    defaultDescription: PropTypes.string,
    defaultDateFrom: PropTypes.string,
    defaultLong: PropTypes.number,
    defaultLat: PropTypes.number,
    isOpen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    edit: PropTypes.bool,
    withName: PropTypes.bool,
    loadIs: PropTypes.bool,
    reFetch: PropTypes.bool,
    cutVideos: PropTypes.object,
    stylesForAerial: PropTypes.object,
};

export default EditModal;
