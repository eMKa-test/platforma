import React from "react";
import * as PropTypes from "prop-types";
import {
    Button, Input, InputGroup, InputGroupAddon,
} from "reactstrap";

const CreateSubline = (
    {
        onChange,
        onClick,
        onDelete,
        id,
        title,
        description,
    },
) => {
    return (
        <React.Fragment>
            <InputGroup className="col-12 pl-0 mb-1">
                <InputGroupAddon
                    addonType="prepend">
                    <Button
                        color="light"
                        onClick={onDelete}>
                        <i className="text-danger fa fa-trash d-block" />
                    </Button>
                </InputGroupAddon>
                <Input
                    value={title}
                    onChange={onChange(id, "title")}
                    placeholder="Название зоны" />
                <Input
                    value={description}
                    onChange={onChange(id, "description")}
                    placeholder="Описание зоны" />
                <InputGroupAddon
                    addonType="append">
                    <Button
                        color="light"
                        onClick={onClick}>
                        <i className="text-success fa fa-check d-block" />
                    </Button>
                </InputGroupAddon>
            </InputGroup>
        </React.Fragment>
    );
}

CreateSubline.propTypes = {
    onClick: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
};

export default CreateSubline;
