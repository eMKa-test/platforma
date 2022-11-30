import React from "react";
import isEmpty from "lodash/isEmpty";
import * as PropTypes from "prop-types";
import {
    Table, Button, Card, CardHeader, Modal, ModalHeader,
} from "reactstrap";

import "./styles.css";
import ContentProvider from "../../../../ContentProvider";
import { deleteData } from "../../../../ContentProvider/fetch";
import Form from "./Form";
import types from "./types";
import DeleteModal from "../../../common/DeleteModal";

const url = "/admin/api/promoFilter";

const destroyRow = async (id, callback) => {
    try {
        await deleteData({ url: `${url}/${id}` });
        callback();
    } catch (e) {
        warn(e);
    }
};

function Filters(props) {
    const { currentCompany } = props;
    const [row, setRow] = React.useState(false);
    const [deleteId, setDelete] = React.useState(false);
    return (
        <ContentProvider
            startParams={{
                companyId: currentCompany.id,
            }}
            url={url}>
            {({ payload, loading, refresh }) => {
                return (
                    <Card className="PromoFilters">
                        <CardHeader>
                            <div className="d-flex justify-content-between align-items-center">
                                Доступные фильтры
                                <Button
                                    size="sm"
                                    color="primary"
                                    disabled={Boolean(row)}
                                    onClick={() => setRow(true)}>
                                    <span className="icon-plus" />
                                </Button>
                            </div>
                        </CardHeader>
                        <Table hover>
                            <tbody>
                                <tr>
                                    <th>Название фильтра</th>
                                    <th>Тип фильтра</th>
                                    <th className="PromoFilters__last-col">Действия</th>
                                </tr>
                                {Array.isArray(payload) ? (
                                    payload.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                {item.title}
                                            </td>
                                            <td>
                                                {types[item.type]}
                                            </td>
                                            <td className="PromoFilters__last-col">
                                                <Button
                                                    color="danger"
                                                    size="sm"
                                                    className="mr-2"
                                                    disabled={Boolean(row)}
                                                    onClick={() => setDelete(item.id)}>
                                                    <span className="icon-trash" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    disabled={Boolean(row)}
                                                    onClick={() => setRow(item)}>
                                                    <span className="icon-pencil" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : null}
                            </tbody>
                        </Table>
                        <Modal
                            className="modal-primary"
                            isOpen={Boolean(row)}
                            toggle={() => setRow(null)}>
                            <ModalHeader toggle={() => setRow(null)}>
                                {!isEmpty(row) ? "Редактирование фильтра" : "Добавление фильтра"}
                            </ModalHeader>
                            <Form
                                url={url}
                                row={row}
                                currentCompany={currentCompany}
                                afterSubmit={() => {
                                    setRow(null);
                                    refresh();
                                }} />
                        </Modal>
                        <DeleteModal
                            isOpen={Boolean(deleteId)}
                            toggleModal={() => setDelete(false)}
                            submit={(ev) => {
                                ev.preventDefault();
                                destroyRow(deleteId, () => {
                                    setDelete(false);
                                    refresh();
                                });
                            }} />
                    </Card>
                );
            }}
        </ContentProvider>
    );
}

Filters.propTypes = {
    currentCompany: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }).isRequired,
};

export default React.memo(Filters);
