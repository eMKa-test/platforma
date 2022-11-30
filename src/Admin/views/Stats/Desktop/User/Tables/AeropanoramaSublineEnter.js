import React from "react";
import * as PropTypes from "prop-types";
import Table from "reactstrap/es/Table";

import { formatDate, getBrowser } from "../../../../../../utils/helpers";

function AeropanoramaSublineEnter(props) {
    const { payload } = props;
    return (
        <Table
            hover
            className="admin-main-hits_table">
            <tbody>
                <tr>
                    <th>Дата события</th>
                    <th>Компания/отрезок/ID аэропанорамы</th>
                    <th>ID/Зона</th>
                    <th>Браузер</th>
                </tr>
                {Array.isArray(payload) ? (
                    payload.map((item) => (
                        <tr key={item.createdAt}>
                            <td>
                                {formatDate(item.createdAt)}
                            </td>
                            <td>
                                {item.meta && `${item.meta.company}/${item.meta.lineID}/${item.meta.aeroId}`}
                            </td>
                            <td>
                                {item.meta && `${item.meta.id}/${item.meta.title}`}
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

AeropanoramaSublineEnter.propTypes = {
    payload: PropTypes.any,
};

export default AeropanoramaSublineEnter;
