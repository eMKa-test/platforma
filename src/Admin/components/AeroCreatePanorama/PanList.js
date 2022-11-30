import React from "react";
import * as PropTypes from "prop-types";
import {
    Button,
    ListGroup,
    ListGroupItem,
} from "reactstrap";

const PanList = (
    {
        panoramas,
        onSubmit,
        showPanList,
        aeropanoramas,
        currentPanID,
        onClose
    },
) => {
    const result = aeropanoramas.map((pan) => pan.id).concat(currentPanID);
    const accessFlyPanoramas = panoramas.filter((pan) => !result.includes(pan.id));
    return (
        <div
            onSubmit={onSubmit}
            className={`panlist-wrapper ${showPanList ? "show_list" : "hide_list"}`}>
            <p className="mb-2 text-center">Доступные паноармы</p>
            <ListGroup>
                {
                    accessFlyPanoramas.length > 0 ? (
                        <React.Fragment>
                            {
                                accessFlyPanoramas.map((pan, i) => (
                                    <ListGroupItem
                                        className={i === accessFlyPanoramas.length - 1 ? "mb-1 py-2" : " py-2"}
                                        key={pan.id}
                                        onClick={onSubmit(pan.id, null, "aeropanoramas")}
                                        tag="button"
                                        action>
                                        {
                                            `ID: ${pan.id}`
                                        }
                                    </ListGroupItem>
                                ))
                            }
                        </React.Fragment>
                    ) : (
                        <p className="text-center mt-0 mb-2">
                            Отсутствуют
                        </p>
                    )
                }
            </ListGroup>
            <Button
                onClick={() => onClose(false)}
                className="float-right"
                size="sm"
                color="light">
                Отмена
            </Button>
        </div>
    );
};

PanList.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    showPanList: PropTypes.bool.isRequired,
    panoramas: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    aeropanoramas: PropTypes.arrayOf(PropTypes.object),
    currentPanID: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default PanList;
