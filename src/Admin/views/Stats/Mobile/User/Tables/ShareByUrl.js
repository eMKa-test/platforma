import React from "react";
import * as PropTypes from "prop-types";
import Table from "reactstrap/es/Table";

import { formatDate, getAppInfo } from "../../../../../../utils/helpers";

function ShareByUrl(props) {
    const { payload } = props;
    return (
        <Table
            hover
            className="admin-main-hits_table">
            <tbody>
                <tr>
                    <th>Дата события</th>
                    <th>Ссылка на файл</th>
                    <th>Тип файла</th>
                    <th>Тип (контент/промо/стрим)</th>
                </tr>
                {Array.isArray(payload) ? (
                    payload.map((item) => (
                        <tr key={item.createdAt}>
                            <td>
                                {formatDate(item.createdAt)}
                            </td>
                            <td>
                                {item.meta && item.meta.source}
                            </td>
                            <td>
                                {item.meta && item.meta.mediaType}
                            </td>
                            <td>
                                {item.meta && item.meta.seectionType}
                            </td>
                            <td>
                                {getAppInfo(item.userAgent)}
                            </td>
                        </tr>
                    ))
                ) : null}
            </tbody>
        </Table>
    );
}

ShareByUrl.propTypes = {
    payload: PropTypes.any,
};

export default ShareByUrl;
