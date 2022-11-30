import React from "react";
import * as PropTypes from "prop-types";
import Table from "reactstrap/es/Table";

import { formatDate, getBrowser } from "../../../../../../utils/helpers";

function SlideShowView(props) {
    const { payload } = props;
    return (
        <Table
            hover
            className="admin-main-hits_table">
            <tbody>
                <tr>
                    <th>Дата события</th>
                    <th>Начальный слайд</th>
                    <th>→</th>
                    <th>Последний слайд</th>
                    <th>Просмотрено слайдов</th>
                    <th>Браузер</th>
                </tr>
                {Array.isArray(payload) ? (
                    payload.map((item) => (
                        <tr key={item.createdAt}>
                            <td>
                                {formatDate(item.createdAt)}
                            </td>
                            <td>
                                {item.meta && `${item.meta.firstSlide} из ${item.meta.totalSlides}`}
                            </td>
                            <td />
                            <td>
                                {item.meta && `${item.meta.lastSlide} из ${item.meta.totalSlides}`}
                            </td>
                            <td>
                                {item.meta && item.meta.viewedCountSlides}
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

SlideShowView.propTypes = {
    payload: PropTypes.any,
};

export default SlideShowView;
