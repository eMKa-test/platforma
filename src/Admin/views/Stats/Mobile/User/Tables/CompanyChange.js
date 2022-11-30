import React from "react";
import * as PropTypes from "prop-types";
import Table from "reactstrap/es/Table";

import { formatDate, getAppInfo } from "../../../../../../utils/helpers";

function CompanyChange(props) {
    const { payload } = props;
    return (
        <Table
            hover
            className="admin-main-hits_table">
            <tbody>
                <tr>
                    <th>Дата события</th>
                    <th>Переход с</th>
                    <th>Переход на</th>
                    <th>Устройство</th>
                </tr>
                {Array.isArray(payload) ? (
                    payload.map((item) => (
                        <tr key={item.createdAt}>
                            <td>
                                {formatDate(item.createdAt)}
                            </td>
                            <td>
                                {item.meta && item.meta.from}
                            </td>
                            <td>
                                {item.meta && item.meta.to}
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

CompanyChange.propTypes = {
    payload: PropTypes.any,
};

export default CompanyChange;
