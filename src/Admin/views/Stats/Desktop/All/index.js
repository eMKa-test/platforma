import React from "react";
import * as PropTypes from "prop-types";
import Table from "reactstrap/es/Table";
import Pagination from "../../../../layout/DefaultPagination";
import ContentProvider from "../../../../../ContentProvider";
import { GUEST_USER } from "../../../../constants";

function AllStats(props) {
    const { setUser, event, includeStaff = false } = props;
    return (
        <ContentProvider
            startParams={{ event, source: "SITE", includeStaff }}
            url="/admin/api/siteEvents/byUsers">
            {(context) => {
                const {
                    payload, total, limit, page, onChangePage, onChangeRowsPerPage,
                } = context;
                return (
                    <React.Fragment>
                        <div className="d-flex justify-content-between align-items-center">
                            <Pagination
                                total={total}
                                onPagination={(p, l) => {
                                    if (l !== limit) {
                                        onChangeRowsPerPage(l);
                                    }
                                    if (p !== page) {
                                        onChangePage(p);
                                    }
                                }}
                                pagination={{
                                    page,
                                    limit,
                                }} />
                            <div>
                                {Array.isArray(payload) ? `Всего событий данного типа: ${payload.reduce((acc, item) => {
                                    return acc + Number(item.total || 0);
                                }, 0)}` : null}
                            </div>
                        </div>
                        <Table
                            hover
                            className="admin-main-hits_table">
                            <tbody>
                                <tr>
                                    <th>Имя пользователя</th>
                                    <th>Email пользователя</th>
                                    <th>Статус пользователя</th>
                                    <th>Кол-во событий</th>
                                    <th />
                                </tr>
                                {Array.isArray(payload) ? (
                                    payload.map((item, i) => (
                                        <tr
                                            key={String(i)}
                                            onClick={() => setUser(item.user || GUEST_USER)}>
                                            <td>
                                                {item.user ? item.user.name : GUEST_USER.name}
                                            </td>
                                            <td>
                                                {item.user ? item.user.email : GUEST_USER.email}
                                            </td>
                                            <td>
                                                {item.user ? item.user.kind : GUEST_USER.kind}
                                            </td>
                                            <td>
                                                {item.total}
                                            </td>
                                            <td>
                                                <span className="icon-arrow-right" />
                                            </td>
                                        </tr>
                                    ))
                                ) : null}
                            </tbody>
                        </Table>
                    </React.Fragment>
                );
            }}
        </ContentProvider>
    );
}

AllStats.propTypes = {
    setUser: PropTypes.func.isRequired,
    event: PropTypes.string.isRequired,
    includeStaff: PropTypes.bool,
};

export default AllStats;
