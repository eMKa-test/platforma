import React, { useState } from "react";
import * as PropTypes from "prop-types";
import { Button, Input } from "reactstrap";
import { postData, delData } from "api";

const SublineItem = (
    {
        sub,
        sub: {
            id,
            title,
            gps,
        },
        line,
        list,
        getSublinesList,
        checkChangeSublines,
        setCenterForSubline,
        selectedSubline,
    },
) => {
    const [editMode, setEditMode] = useState(false);
    const [changedSub, setValues] = useState({ ...sub });

    const handleChange = (iD, type) => ({ target: { value } }) => {
        setValues({
            ...changedSub,
            [type]: value,
        });
    };

    const submitChanges = () => {
        const url = `/admin/api/lines/${line.id}/sublines/${id}`;
        postData({
            mainUrl: url,
            body: { ...changedSub },
        }).then(() => {
            setEditMode(false);
            getSublinesList();
        });
    };

    const deleteSubline = () => {
        const answer = confirm("Точно удалить?");
        if (!answer) {
            return null;
        }
        const url = `/admin/api/lines/${line.id}/sublines/${id}`;
        delData(url).then(() => {
            getSublinesList();
            checkChangeSublines(list, id);
        });
    };

    return (
        <tr
            key={title}
            className={selectedSubline && selectedSubline.id === id ? "bg-warning" : ""}>
            <th scope="row">
                {
                    id
                }
            </th>
            <td className="p-2">
                <Input
                    disabled={!editMode}
                    onChange={handleChange(id, "title")}
                    value={changedSub.title || ""} />
            </td>
            <td className="p-2">
                <Input
                    disabled={!editMode}
                    onChange={handleChange(id, "description")}
                    value={changedSub.description || ""} />
            </td>
            <td className="p-2">
                {
                    gps ? <i title={`д: ${gps.lat} \nш: ${gps.long}`} className="d-block text-center fa fa-check text-success" />
                        : <i title={`д: нет \nш: нет`} className="d-block text-center fa fa-times text-danger" />

                }
            </td>
            <td className="p-2">
                {
                    editMode ?
                        (
                            <Button
                                color="light"
                                title="редактировать зону"
                                onClick={submitChanges}>
                                <i className="text-success fa fa-check d-block" />
                            </Button>
                        ) : (
                            <Button
                                color="light"
                                title="Редактировать зону"
                                onClick={() => setEditMode(!editMode)}>
                                <i className="fa fa-pencil d-block" />
                            </Button>
                        )
                }
            </td>
            <td className="p-2">
                <Button
                    color="light"
                    title="Удалить зону"
                    onClick={deleteSubline}>
                    <i className="text-danger fa fa-trash d-block" />
                </Button>
            </td>
            <td className="p-2">
                <Button
                    color="light"
                    title="Установить центр зоны"
                    onClick={setCenterForSubline(sub, true)}>
                    <i className="text-success fa fa-dot-circle-o d-block" />
                </Button>
            </td>
        </tr>
    );
};

SublineItem.propTypes = {
    checkChangeSublines: PropTypes.func.isRequired,
    line: PropTypes.object.isRequired,
    list: PropTypes.array.isRequired,
    sub: PropTypes.object.isRequired,
    getSublinesList: PropTypes.func.isRequired,
    setCenterForSubline: PropTypes.func.isRequired,
    selectedSubline: PropTypes.object,
};

export default SublineItem;
