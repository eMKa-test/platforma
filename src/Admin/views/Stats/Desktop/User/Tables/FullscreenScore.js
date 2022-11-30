import React from "react";
import * as PropTypes from "prop-types";
import Table from "reactstrap/es/Table";

import { formatDate, getBrowser } from "../../../../../../utils/helpers";

function FullscreenScore(props) {
    const { payload } = props;
    return (
        <Table
            hover
            className="admin-main-hits_table">
            <tbody>
                <tr>
                    <th>Дата события</th>
                    <th>Тип файла</th>
                    <th>Тип (контент/промо)</th>
                    <th>Кол-во просмотренного контента</th>
                    <th>Браузер</th>
                </tr>
                {Array.isArray(payload) ? (
                    payload.map((item) => (
                        <tr key={item.createdAt}>
                            <td>
                                {formatDate(item.createdAt)}
                            </td>
                            <td>
                                {item.meta && item.meta.mediaType}
                            </td>
                            <td>
                                {item.meta && item.meta.contentType}
                            </td>
                            <td>
                                {item.meta && item.meta.viewedUniqueContent}
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

FullscreenScore.propTypes = {
    payload: PropTypes.any,
};

export default FullscreenScore;
