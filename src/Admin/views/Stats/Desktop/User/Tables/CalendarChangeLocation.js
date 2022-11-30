import React from "react";
import * as PropTypes from "prop-types";
import Table from "reactstrap/es/Table";

import { formatDate, getBrowser } from "../../../../../../utils/helpers";

function CalendarChangeLocation(props) {
    const { payload } = props;
    return (
        <Table
            hover
            className="admin-main-hits_table">
            <tbody>
                <tr>
                    <th>Дата события</th>
                    <th>Вкладка</th>
                    <th>Компания</th>
                    <th>Выбранная дата</th>
                    <th>Браузер</th>
                </tr>
                {Array.isArray(payload) ? (
                    payload.map((item) => (
                        <tr key={item.createdAt}>
                            <td>
                                {formatDate(item.createdAt)}
                            </td>
                            <td>
                                {item.meta && item.meta.tab}
                            </td>
                            <td>
                                {item.meta && item.meta.companySlug}
                            </td>
                            <td>
                                {item.meta && item.meta.date}
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

CalendarChangeLocation.propTypes = {
    payload: PropTypes.any,
};

export default CalendarChangeLocation;
