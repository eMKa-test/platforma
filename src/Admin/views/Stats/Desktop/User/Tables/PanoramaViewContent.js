import React from "react";
import * as PropTypes from "prop-types";
import Table from "reactstrap/es/Table";

import { formatDate, getBrowser, convertDetails } from "../../../../../../utils/helpers";

function PanoramaViewContent(props) {
    const { payload } = props;
    return (
        <Table
            hover
            className="admin-main-hits_table">
            <tbody>
                <tr>
                    <th>Дата события</th>
                    <th>Компания/отрезок/ID панорамы</th>
                    <th>Тип контента</th>
                    <th>Контент</th>
                    <th>Браузер</th>
                </tr>
                {Array.isArray(payload) ? (
                    payload.map((item) => (
                        <tr key={item.createdAt}>
                            <td>
                                {formatDate(item.createdAt)}
                            </td>
                            <td>
                                {item.meta && `${item.meta.company}/${item.meta.lineID}/${item.meta.contentID}`}
                            </td>
                            <td>
                                {item.meta && convertDetails(item.meta.mediaType)}
                            </td>
                            <td>
                                {item.meta && item.meta.source}
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

PanoramaViewContent.propTypes = {
    payload: PropTypes.any,
};

export default PanoramaViewContent;
