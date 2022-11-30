import React from "react";
import * as PropTypes from "prop-types";
import {
    InputGroup, InputGroupAddon, InputGroupText, ButtonGroup, Button,
} from "reactstrap";

import angleIcon from "../../../assets/icons/angleIcon.svg";
import imgIcon from "../../../../Desktop/assets/icons/imgIcon.svg";
import videoIcon from "../../../../Desktop/assets/icons/videoIcon.svg";

function AngleMod({
    panoramEditMode,
    onCancel,
    onSubmit,
    setPanProp,
    baseAngel,
    correctAngel,
    currentContentEdit,
    setCurrentContentEdit,
    contentAngle,
}) {
    if (panoramEditMode) {
        return (
            <div className="mb-2">
                <InputGroup>
                    <Button
                        outline
                        color="warning"
                        onClick={onCancel}>
                        Отменить
                    </Button>
                    <InputGroupAddon addonType="prepend">
                        {
                            currentContentEdit ? (
                                <InputGroupText>
                                    <img
                                        style={{
                                            width: "13px",
                                            marginRight: "5px",
                                        }}
                                        src={angleIcon}
                                        alt="angle-icon" />
                                    {`${contentAngle} / ${correctAngel}`}
                                </InputGroupText>
                            ) : (
                                <InputGroupText>
                                    <img
                                        style={{
                                            width: "13px",
                                            marginRight: "5px",
                                        }}
                                        src={angleIcon}
                                        alt="angle-icon" />
                                    {`${baseAngel} / ${correctAngel}`}
                                </InputGroupText>
                            )
                        }
                    </InputGroupAddon>
                    <Button
                        color="primary"
                        onClick={onSubmit}>
                        Применить
                    </Button>
                </InputGroup>
            </div>
        );
    }
    return (
        <div className="mb-2">
            <InputGroup>
                {
                    currentContentEdit && (
                        <Button
                            outline
                            color="warning"
                            onClick={() => setCurrentContentEdit(null)}>
                            Отменить
                        </Button>
                    )
                }
                <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                        <img
                            style={{
                                width: "13px",
                                marginRight: "5px",
                            }}
                            src={angleIcon}
                            alt="angle-icon" />
                        {baseAngel}
                        {"°"}
                    </InputGroupText>
                    {
                        currentContentEdit && (
                            <InputGroupText>
                                <img
                                    style={{
                                        width: "18px",
                                        marginRight: "10px",
                                    }}
                                    src={currentContentEdit.type === "VIDEO"
                                        ? videoIcon : imgIcon}
                                    alt="content-icon" />
                                {currentContentEdit.magneticAngle}
                                {"°"}
                            </InputGroupText>
                        )
                    }
                </InputGroupAddon>
                <ButtonGroup>
                    <Button
                        color="primary"
                        outline
                        onClick={() => setPanProp("panoramEditMode", true)}
                        active={panoramEditMode}>
                        Коррекция
                        {currentContentEdit ? " контента" : " панорамы"}
                    </Button>
                </ButtonGroup>
            </InputGroup>
        </div>
    );
}

AngleMod.propTypes = {
    panoramEditMode: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    setPanProp: PropTypes.func.isRequired,
    setCurrentContentEdit: PropTypes.func.isRequired,
    baseAngel: PropTypes.number,
    correctAngel: PropTypes.number,
    contentAngle: PropTypes.number,
    currentContentEdit: PropTypes.object,
};

export default React.memo(AngleMod);
