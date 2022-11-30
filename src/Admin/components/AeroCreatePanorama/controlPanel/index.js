import React from "react";
import * as PropTypes from "prop-types";
import { InputGroup } from "reactstrap";
import { INPUT_PROPERTIES, INPUT_TYPES, getValueFromType } from "./optionProperties";
import { Input, Select } from "./createInput";


const ControlPanel = ({
    onChange,
    object,
    editMode,
    addPolygon,
    removePolygon,
    submitPolygon,
    sublineList,
    onSelect,
    editPolygon,
}) => {
    return (
        <div className="control-panel">
            <div className="control-panel__position-control">
                {
                    editMode && (
                        <React.Fragment>
                            <p className="control-panel__title">Настройка полигона</p>
                            {
                                INPUT_TYPES.map((propName) => (
                                    <InputGroup key={propName}>
                                        {
                                            INPUT_PROPERTIES[propName].map((props) => (
                                                <Input
                                                    key={props.title}
                                                    {...props}
                                                    value={getValueFromType(propName, object[propName][props.type])}
                                                    propName={propName}
                                                    onChange={onChange} />
                                            ))
                                        }
                                    </InputGroup>
                                ))
                            }
                            {
                                !editPolygon && (
                                    <Select
                                        list={sublineList}
                                        onSelect={onSelect} />
                                )
                            }
                        </React.Fragment>
                    )
                }
            </div>
            <div className="control-panel__btn-group">
                {
                    !editMode ? (
                        <button
                            type="button"
                            className="btn-line"
                            onClick={addPolygon}>
                            Добавить полигон
                        </button>
                    ) : (
                        <React.Fragment>
                            <button
                                type="button"
                                className="btn-clear"
                                onClick={removePolygon}>
                                Отмена
                            </button>
                            <button
                                type="button"
                                className="btn-submit"
                                onClick={submitPolygon}>
                                Подтвердить
                            </button>
                        </React.Fragment>
                    )
                }
            </div>
        </div>
    );
};

ControlPanel.propTypes = {
    onChange: PropTypes.func.isRequired,
    addPolygon: PropTypes.func.isRequired,
    submitPolygon: PropTypes.func.isRequired,
    removePolygon: PropTypes.func.isRequired,
    object: PropTypes.object,
    editMode: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    sublineList: PropTypes.array.isRequired,
    title: PropTypes.string,
    editPolygon: PropTypes.object,
};

export default ControlPanel;
