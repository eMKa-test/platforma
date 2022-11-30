import React, { Component } from "react";
import { getData } from "api";

import Pagination, { defaultSettings } from "../../layout/DefaultPagination";
import { convertDetails, convertStatus } from "../../../utils/helpers";

class Activity extends Component {
    state = {
        activities: [],
        pagination: { ...defaultSettings },
        total: 0,
    }

    componentDidMount() {
        this.fetchLogs();
    }

    fetchLogs = () => {
        getData({
            mainUrl: "/admin/api/activity/upload",
            params: { ...this.state.pagination },
        }).then(({ payload, pagination }) => {
            this.setState({
                activities: payload,
                pagination: {
                    page: pagination.page,
                    limit: pagination.limit,
                },
                total: pagination.total,
            });
        });
    }

    sortContent = (type, detail, total) => {
        switch (type) {
            case "CONTENT": return (
                Object.entries(detail).map((els, i) => (
                    <p key={i} className="m-0 w-75 d-flex justify-content-between">
                        <span>
                            {convertDetails(els[0])}
                            {": "}
                        </span>
                        <span>
                            {els[1]}
                        </span>
                    </p>))
            );
            case "TV": return (
                <p className="m-0 w-75 d-flex justify-content-between">
                    <span>
                        TV
                        {": "}
                    </span>
                    <span>
                        {total}
                    </span>
                </p>
            );
            case "TIMELAPSE": return (
                <p className="m-0 w-75 d-flex justify-content-between">
                    <span>
                        TIMELAPSE
                        {": "}
                    </span>
                    <span>
                        {total}
                    </span>
                </p>
            );
            default: return (
                <p className="m-0 w-75 d-flex justify-content-between">
                    <span>
                        UNKNOWN
                        {": "}
                    </span>
                    <span>
                        {total}
                    </span>
                </p>
            );
        }
    }

    renderLog = (arr) => (
        arr.map((el, i) => (
            <tr key={i}>
                <th className="activity-first-col">
                    {moment(el.dateStartUpload).format("DD/MM")}
                    {" | "}
                    {moment(el.dateStartUpload).format("HH:mm:ss")}
                    {" "}
                    &#8646;
                    {" "}
                    {el.dateFinUpload ? moment(el.dateFinUpload).format("HH:mm:ss") : "выполняется"}
                </th>
                <td>
                    {el.user}
                    {" ("}
                    {el.userId}
                    {")"}
                </td>
                <td>
                    {this.sortContent(el.type, el.detail, el.total)}
                </td>
                <td>{convertStatus(el.status)}</td>
                <td>{moment(el.date).format("DD/MM/YY")}</td>
                <td>{el.total}</td>
                <td>{el.totalAttempts}</td>
            </tr>
        ))
    )

    handlePagination = (page, limit) => this.setState(() => ({ pagination: { page, limit } }), this.fetchLogs);

    render() {
        const { activities, pagination, total } = this.state;
        return (
            <div className="activity-container">
                <h4 className="mb-4">Последние загруженные сеты</h4>
                <Pagination
                    total={total}
                    onPagination={this.handlePagination}
                    pagination={pagination} />
                <table className="table mt-4">
                    <thead>
                        <tr>
                            <th>Дата | Начало &#8646; Конец</th>
                            <th>Пользователь</th>
                            <th>Контент</th>
                            <th>Статус</th>
                            <th>На дату</th>
                            <th>Всего</th>
                            <th>Попыток</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.renderLog(activities)
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Activity;
