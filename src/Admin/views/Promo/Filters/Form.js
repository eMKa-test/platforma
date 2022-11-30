import React from "react";
import get from "lodash/get";
import * as PropTypes from "prop-types";
import {
    Button, ButtonGroup, FormGroup, Input, Label, ModalBody, ModalFooter,
} from "reactstrap";

import { COMMON, MONTH } from "./types";
import { postData, putData } from "../../../../ContentProvider/fetch";

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: COMMON,
            ...this.props.row,
        };
    }

    formRef = React.createRef();

    submit = async (ev) => {
        ev.preventDefault();
        const body = {
            title: get(this.formRef.current, "title.value", ""),
            type: this.state.type,
            companyId: this.props.currentCompany.id,
        };
        try {
            const { row, url } = this.props;
            if (row.id > 0) {
                await putData({
                    url: `${url}/${row.id}`,
                    body,
                });
            } else {
                await postData({ url, body });
            }
        } catch (e) {
            warn(e);
        } finally {
            this.props.afterSubmit();
        }
    };

    render() {
        const { currentCompany } = this.props;
        const { type, title } = this.state;
        return (
            <form
                ref={this.formRef}
                onSubmit={this.submit}>
                <ModalBody>
                    <FormGroup>
                        <Label htmlFor="name">Название фильтра</Label>
                        <Input
                            type="text"
                            id="title"
                            defaultValue={title}
                            placeholder="Введите название фильтра"
                            required />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="name">Тип фильтра</Label>
                        <ButtonGroup
                            className="mb-3 w-100 admin-modal__buttons">
                            <Button
                                type="button"
                                active={type === COMMON}
                                onClick={() => { this.setState({ type: COMMON }); }}>
                                По умолчанию
                            </Button>
                            <Button
                                type="button"
                                active={type === MONTH}
                                onClick={() => { this.setState({ type: MONTH }); }}>
                                Помесячный
                            </Button>
                        </ButtonGroup>
                    </FormGroup>
                    <FormGroup>
                        <p>{`Фильтр принадлежит компании: ${currentCompany.name}`}</p>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        type="submit"
                        onClick={this.submit}>
                        Сохранить
                    </Button>
                    <Button
                        color="secondary"
                        type="button"
                        onClick={this.props.afterSubmit}>
                        Отмена
                    </Button>
                </ModalFooter>
            </form>
        );
    }
}

Form.propTypes = {
    row: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.bool]),
    afterSubmit: PropTypes.func.isRequired,
    currentCompany: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    url: PropTypes.string.isRequired,
};

export default Form;
