import React, { Component } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";

import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    FormGroup,
    Input,
} from "reactstrap";


class ModalLogs extends Component {
    state = {
        value: "Ошибок: 0",
    }

    componentDidUpdate(prevProps) {
        if (prevProps.errors.length !== this.props.errors.length && this.props.errors.length > 0) {
            this.setErrsInValue();
        }
        if (prevProps.errors.length > this.props.errors.length && this.props.errors.length === 0) {
            this.resetErrors();
        }
    }

    setErrsInValue = () => {
        let res = "";
        this.props.errors.forEach((ev) => {
            let str = "";
            const placement = ev.object ? `{object:${ev.object} / line:${ev.line} / ${ev.type}}` : `{${ev.type}}`;
            if (ev.errorType) {
                str = `[${ev.time}] [--(${ev.error.errorMsg})--] | ${placement}`;
            } else {
                str = `[${ev.time}] [--status: ${ev.error.status} || ${ev.error.access.error}--] | ${placement}`;
            }
            res += `${str}\n`;
        });
        this.setState({ value: res });
    }

    resetErrors = () => {
        this.setState({ value: "Ошибок: 0" });
    }

    copyMsg = () => {
        const result = document.querySelector("textarea");
        result.focus();
        result.select();
        try {
            const successful = document.execCommand("copy");
            const msg = successful ? "скопирован." : "не скопирован.";
            alert(`Отчет ${msg}`);
            this.props.toggleModal();
        } catch (err) {
            alert("По неизвестным причинам текст не скопировался.\nПовторите копирование или выделите текст и скопируйте вручную.");
        }
    };

    render() {
        const { value } = this.state;
        return (
            <Modal
                isOpen={this.props.showLogs}
                toggle={this.props.toggleModal}
                className="modal-primary">
                <ModalHeader>
                    Отчет по ошибкам
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Input
                            readOnly
                            type="textarea"
                            defaultValue={value}
                            name="text"
                            rows={5}
                            id="exampleText" />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        type="button"
                        onClick={this.copyMsg}>
                        Скопировать отчёт
                    </Button>
                    {" "}
                    <Button
                        color="secondary"
                        type="button"
                        onClick={this.props.toggleModal}>
                        Закрыть
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

ModalLogs.propTypes = {
    showLogs: PropTypes.bool,
    toggleModal: PropTypes.func,
    errors: PropTypes.array,
};

export default connect(
    (state) => ({
        errors: state.errors,
    }),
)(ModalLogs);
