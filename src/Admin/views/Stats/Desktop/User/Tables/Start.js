import React from "react";
import * as PropTypes from "prop-types";
import Table from "reactstrap/es/Table";

import { formatDate, getBrowser } from "../../../../../../utils/helpers";

function Start(props) {
    const { payload } = props;
    return (
        <Table
            hover
            className="admin-main-hits_table">
            <tbody>
                <tr>
                    <th>Дата входа на сайт</th>
                    <th>Используемый путь (URL)</th>
                    <th>Браузер</th>
                </tr>
                {Array.isArray(payload) ? (
                    payload.map((item) => (
                        <tr key={item.createdAt}>
                            <td>
                                {formatDate(item.createdAt)}
                            </td>
                            <td>
                                {item.meta && item.meta.pathname}
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

Start.propTypes = {
    payload: PropTypes.any,
};

export default Start;
