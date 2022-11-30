import React from "react";
import * as PropTypes from "prop-types";
import Table from "reactstrap/es/Table";

import { formatDate, getBrowser } from "../../../../../../utils/helpers";

function LineSelection(props) {
    const { payload } = props;
    return (
        <Table
            hover
            className="admin-main-hits_table">
            <tbody>
                <tr>
                    <th>Дата события</th>
                    <th>Название объекта</th>
                    <th>Название отрезка</th>
                    <th>Путь с которого перешли</th>
                    <th>Браузер</th>
                </tr>
                {Array.isArray(payload) ? (
                    payload.map((item) => (
                        <tr key={item.createdAt}>
                            <td>
                                {formatDate(item.createdAt)}
                            </td>
                            <td>
                                {item.meta && item.meta.projectName}
                            </td>
                            <td>
                                {item.meta && item.meta.lineName}
                            </td>
                            <td>
                                {item.meta && item.meta.from}
                            </td>
                            <td>
                                {getBrowser(item.userAgent)}
                            </td>
                        </tr>
                    ))
                ) : null}
            </tbody>
        </Table>
    );
}

LineSelection.propTypes = {
    payload: PropTypes.any,
};

export default LineSelection;
