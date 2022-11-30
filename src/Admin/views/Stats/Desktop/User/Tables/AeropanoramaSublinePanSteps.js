import React from "react";
import * as PropTypes from "prop-types";
import Table from "reactstrap/es/Table";

import { formatDate, getBrowser } from "../../../../../../utils/helpers";

function AeropanoramaSublinePanSteps(props) {
    const { payload } = props;
    return (
        <Table
            hover
            className="admin-main-hits_table">
            <tbody>
                <tr>
                    <th>Дата события</th>
                    <th>Компания/отрезок/ID аэропанорамы</th>
                    <th>Дата панорам зон</th>
                    <th>ID/Зона</th>
                    <th>Пройдено панорам</th>
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
                                {item.meta && item.meta.subPansDate}
                            </td>
                            <td>
                                {item.meta && `${item.meta.subId}/${item.meta.subName}`}
                            </td>
                            <td>
                                {item.meta && item.meta.subPanSteps}
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

AeropanoramaSublinePanSteps.propTypes = {
    payload: PropTypes.any,
};

export default AeropanoramaSublinePanSteps;
