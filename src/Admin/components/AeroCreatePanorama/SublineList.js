import React from "react";
import * as PropTypes from "prop-types";
import {
    Button,
    ListGroup,
    ListGroupItem,
} from "reactstrap";

const SublineList = (
    {
        sublinesList,
        onSubmit,
        showSublineList,
        subPanoramas,
        onClose,
    },
) => {
    const result = subPanoramas.map((sub) => sub.id);
    const accessSubLinesList = sublinesList.filter((sub) => !result.includes(sub.id));
    return (
        <div className={`sublinelist-wrapper ${showSublineList ? "show_list" : "hide_list"}`}>
            <ListGroup>
                <p className="mb-2 text-center">Доступные зоны</p>
                {
                    accessSubLinesList.length > 0 ? (
                        <React.Fragment>
                            {
                                accessSubLinesList.map((sub) => (
                                    <ListGroupItem
                                        className="py-2"
                                        key={sub.title}
                                        onClick={onSubmit(sub.id, sub.title, "sublines", sub.meta, sub.gps)}
                                        tag="button"
                                        action>
                                        {
                                            `ID:${sub.id} | `
                                        }
                                        {
                                            sub.title
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
                className="float-right mt-2"
                size="sm"
                color="light">
                Отмена
            </Button>
        </div>
    );
};

SublineList.propTypes = {
    sublinesList: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    onSubmit: PropTypes.func.isRequired,
    showSublineList: PropTypes.bool.isRequired,
    subPanoramas: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default SublineList;
