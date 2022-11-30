import React, { useState } from "react";
import isEmpty from "lodash/isEmpty";
import * as PropTypes from "prop-types";
import axios from "axios";
import Dropzone from "react-dropzone";
import {
    Button,
    Card,
    CardBody,
    CardImgOverlay,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Form,
    FormGroup,
    Input,
    Label,
    Progress, ButtonGroup,
} from "reactstrap";

import ContentProvider from "../../ContentProvider";

const PromoEdit = ({
    defaultDateFrom,
    defaultDescription,
    title,
    defaultTmb,
    isOpen,
    toggleModal,
    submit,
    contentId,
    filterSelected,
    changeSelectFilter,
    currentCompany,
}) => {
    const [upload, setUpload] = useState(null);
    const [progress, setProgress] = useState(0);
    const [bg, setBg] = useState({ backgroundImage: `url(${defaultTmb})` });

    const config = {
        onUploadProgress: (progressEvent) => {
            const prog = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(prog);
        },
    };

    const submitFileUpload = () => {
        const upl = new FormData();
        upl.append("file", upload);
        axios
            .post(`/admin/api/companyContent/${contentId}/tmb`, upl, config)
            .then(({ data }) => {
                if (data.success) {
                    setUpload(null);
                }
            })
            .catch((e) => warn(e, "upload err"));
    };

    const handleFilePreview = (acceptedFiles) => {
        const reader = new FileReader();
        setUpload(acceptedFiles[0]);
        reader.onload = function readerOnload(e) {
            setBg({ backgroundImage: `url('${e.target.result}')` });
        };
        reader.readAsDataURL(acceptedFiles[0]);
    };

    return (
        <Modal
            isOpen={isOpen}
            toggle={toggleModal}
            className="modal-primary">
            <ModalHeader toggle={toggleModal}>{title}</ModalHeader>
            <Form onSubmit={submit}>
                <ModalBody>
                    <FormGroup>
                        <Label htmlFor="dateFrom">Наименование</Label>
                        <Input
                            type="text"
                            id="description"
                            defaultValue={defaultDescription} />
                    </FormGroup>
                    <p className="my-2">
                        Текущая тумба:
                    </p>
                    <Card className="mb-2">
                        <CardImgOverlay>
                            <span>
                                Поменять тумбу
                            </span>
                        </CardImgOverlay>
                        <CardBody
                            className="image-thumb cursor-pointer"
                            style={bg}>
                            <Dropzone
                                className="imageUpload"
                                activeClassName="imageUpload--active"
                                acceptClassName="imageUpload--accept"
                                rejectClassName="imageUpload--reject"
                                accept="image/*"
                                onDrop={handleFilePreview}>
                                {bg.backgroundImage === "none" && <p>Зона загрузки файла</p>}
                            </Dropzone>
                            {upload && (progress === 0 || progress === 100) ? (
                                <Button
                                    className="imageSaveBtn"
                                    color="success"
                                    onClick={submitFileUpload}>
                                    <i className="icon-cloud-upload icons d-block" />
                                </Button>
                            ) : null}
                            {progress > 0 && progress < 100 ? (
                                <Progress
                                    className="ProgressBar"
                                    value={25} />
                            ) : null}
                        </CardBody>
                    </Card>
                    <FormGroup className="mt-3">
                        <Label htmlFor="dateFrom">Промофильтры</Label>
                        <ContentProvider
                            startParams={{
                                companyId: currentCompany.id,
                            }}
                            url="/admin/api/promoFilter">
                            {({ payload, loading }) => {
                                if (isEmpty(payload)) {
                                    return null;
                                }
                                return (
                                    <React.Fragment>
                                        <input
                                            type="hidden"
                                            name="filters"
                                            value={payload.map((f) => f.id)} />
                                        <ButtonGroup className="admin-modal__promo-filter-btn-group admin-modal__buttons">
                                            {payload.map((item) => (
                                                <Button
                                                    key={item.id}
                                                    className="rounded-0 m-1"
                                                    onClick={() => changeSelectFilter(item.id)}
                                                    active={filterSelected.includes(item.id)}>
                                                    {item.title}
                                                </Button>
                                            ))}
                                        </ButtonGroup>
                                    </React.Fragment>
                                );
                            }}
                        </ContentProvider>
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Label htmlFor="dateFrom">Дата</Label>
                        <Input
                            type="date"
                            id="dateFrom"
                            defaultValue={defaultDateFrom}
                            required />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="success"
                        type="submit">
                        Сохранить
                    </Button>
                    <Button
                        color="secondary"
                        type="button"
                        onClick={toggleModal}>
                        Отмена
                    </Button>
                </ModalFooter>
            </Form>
        </Modal>
    );
};

PromoEdit.propTypes = {
    title: PropTypes.string,
    contentId: PropTypes.number,
    defaultTmb: PropTypes.string,
    defaultDescription: PropTypes.string,
    defaultDateFrom: PropTypes.string,
    filterSelected: PropTypes.array.isRequired,
    isOpen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    changeSelectFilter: PropTypes.func.isRequired,
    currentCompany: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }).isRequired,
};

export default PromoEdit;
