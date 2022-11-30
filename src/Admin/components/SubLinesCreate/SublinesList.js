import React from "react";
import * as PropTypes from "prop-types";
import { Table } from "reactstrap";
import SublineItem from "./SublineItem";

const CreateSubline = (
    {
        list,
        line,
        ...other
    },
) => {
    return (
        <Table
            bordered
            hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Описание</th>
                    <th>Центр</th>
                </tr>
            </thead>
            <tbody>
                {
                    list.map((sub, i) => (
                        <SublineItem
                            {...other}
                            list={list}
                            key={sub.id}
                            sub={sub}
                            line={line}
                            index={i} />
                    ))
                }
            </tbody>
        </Table>
    );
};

CreateSubline.propTypes = {
    list: PropTypes.array,
    line: PropTypes.object,
};

export default CreateSubline;
