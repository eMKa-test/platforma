import React from "react";
import * as PropTypes from "prop-types";
import { Label, CustomInput } from "reactstrap";

const Input = ({
    title,
    type,
    min,
    max,
    step,
    onChange,
    propName,
    value,
}) => {
    return (
        <Label for={type}>
            {title}
            <CustomInput
                type="range"
                id={type}
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={onChange(propName, type)} />
        </Label>
    )
};

Input.propTypes = {
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
};

const Select = ({
    onSelect,
    list,
}) => {
    return (
        <CustomInput
            type="select"
            id="sublineList"
            onChange={onSelect}>
            <option value={""}>Выберите Зону</option>
            {
                list.map((sub) => (
                    <option
                        key={sub.id}
                        value={sub.id}>
                        ID:{sub.id} / {sub.title}
                    </option>
                ))
            }
        </CustomInput>
    )
};

Select.propTypes = {
    list: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export { Input, Select };
