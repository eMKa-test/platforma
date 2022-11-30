import React, { Component } from "react";
import axios from "axios";


import { connect } from "react-redux";

import Button from "../Components/Buttons/Button";
import Modal from "../Components/Modal";
import ContentLoad from "./ContentLoad";
import ContentLoadStream from "./ContentLoadStream";
import ContentLoadTimelapse from "./ContentLoadTimelapse";
import ReportDesk from "../Components/ReportDesk/ReportDesk";
import EventBlock from "../Components/EventBlock";
import reupload from "../assets/reload.png";
import calendar from "../assets/calendar.png";
import exitIcon from "../assets/exit_1.png";
import logIcon from "../assets/list_1.png";
import recycleIcon from "../assets/recycle_1.png";
import downloadIcon from "../assets/power.png";
import { Spin, panelBg } from "../helpers";

import { REPEAT_VAL } from "../constants";
import {
    setDate,
    addData,
    resetData,
    resetDone,
    resetErrors,
    setTotal,
    changeTotal,
    resetTotal,
    setReportText,
    resetReportText,
} from "../store/actions/ActionsCreator";

function fetchRequest(method, url, params = {}, config = {}) {
    return axios[method](url, params, config);
}

class AgentPage extends Component {
    state = {
        authSession: false,
        date: moment(new Date()).format("YYYY-MM-DD"),
        objects: [],
        lines: [],
        uploadRun: false,
        totalUpload: [],
        streamUpload: [],
        timelapseUpload: [],
        selectItems: {
            uuid: [],
            total: [],
        },
        countLoadContent: 0,
        done: 0,
        dropMode: false,
        newUploadRun: true,
        reportMode: false,
        reSubmitUpload: false,
        doneProgress: 0,
        errorsTotal: [],
        bgState: "default",
        showDate: true,
        showLogs: false,
        chunksUploadMode: false,
        reUpload: false,
        uploadEventBlock: false,
        checkUploadEventBlock: false,
    };

    componentDidMount() {
        this.fetchData(new Date());
        this.getAuthSuccess();
        this.props.dispatch(resetData());
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.date !== this.state.date) {
            this.props.dispatch(setDate(this.state.date));
            this.props.dispatch(resetDone());
        }
        if (this.props.errors.length >= REPEAT_VAL && !this.state.chunksUploadMode) {
            this.forceSetChunkMode(true);
        }
        if (!prevState.checkUploadEventBlock && this.state.checkUploadEventBlock) {
            this.checkDropMode();
        }
    }

    disactiveDate = (val) => this.setState({ showDate: val });

    handleChangeDate = (e) => {
        this.setState({
            date: e.target.value,
        });
    };

    getAuthSuccess = () => fetchRequest("get", "/agent/api/users/my")
        .then(({ data }) => {
            if (data.success) {
                this.setState({ authSession: true });
            }
        });

    fetchData = (date) => {
        if (!this.state.uploadRun) {
            this.props.dispatch(setDate(moment(date).format("YYYY-MM-DD")));
            this.props.dispatch(resetDone());
            fetchRequest("get", "/agent/api/projectsList/")
                .then((res) => {
                    if (res.data.success) {
                        const totalObjects = res.data.payload.map((el) => el);
                        const totalLines = totalObjects.map((el) => el.lines);
                        this.setState({
                            objects: totalObjects,
                            lines: totalLines,
                        });
                    }
                });
        }
        return null;
    };

    fetchUploadedObject = () => {
        fetchRequest("post", "/agent/api/content/uploadedSet/", { date: this.props.date })
            .then(() => {
                this.setState(
                    () => ({ reSubmitUpload: false }),
                    () => {
                        this.calcObjectUploadDone();
                    },
                );
            })
            .catch(() => {
                this.setState(
                    () => ({ reSubmitUpload: true }),
                    () => {
                        this.calcObjectUploadDone(false, 0, this.fetchUploadedObject);
                    },
                );
            });
    };

    fetchUploadedTimelapse = () => {
        fetchRequest("post", "/agent/api/content/uploadedTimelapse/")
            .then(() => {
                this.setState(
                    () => ({ reSubmitUpload: false }),
                    () => {
                        this.calcObjectUploadDone();
                    },
                );
            })
            .catch((e) => {
                this.setState(
                    () => ({ reSubmitUpload: true }),
                    () => {
                        this.calcObjectUploadDone(false, 0, this.fetchUploadedTimelapse);
                    },
                );
            });
    };

    fetchUploadedStream = () => {
        fetchRequest("post", "/agent/api/content/uploadedTv/")
            .then(() => {
                this.setState(
                    () => ({ reSubmitUpload: false }),
                    () => {
                        this.calcObjectUploadDone();
                    },
                );
            })
            .catch(() => {
                this.setState(
                    () => ({ reSubmitUpload: true }),
                    () => {
                        this.calcObjectUploadDone(false, 0, this.fetchUploadedStream);
                    },
                );
            });
    };

    fetchUploadedEvent = (param) => {
        if (param.total === param.progress) {
            const body = {
                eventName: param.eventName,
            };
            fetchRequest("post", "/agent/api/content/uploadedEventsEnd/", body)
                .then(() => {
                    this.setState(
                        () => ({ reSubmitUpload: false }),
                        () => {
                            this.calcObjectUploadDone();
                        },
                    );
                })
                .catch(() => {
                    this.setState(
                        () => ({ reSubmitUpload: true }),
                        () => {
                            this.calcObjectUploadDone(false, 0, this.fetchUploadedEvent);
                        },
                    );
                });
        }
    };

    changeUploadStatus = (loadResult, errInfo, stream = false) => {
        this.setState(
            (state) => ({
                done: state.done + loadResult,
                errorsTotal: state.errorsTotal.concat(errInfo),
            }),
            () => {
                if (this.state.done === this.state.countLoadContent && errInfo.length === 0 && !stream) {
                    this.setState({ errorsTotal: [] });
                    this.props.dispatch(resetErrors());
                    this.fetchUploadedObject();
                }
                if (this.state.done === this.state.countLoadContent && errInfo.length === 0 && stream) {
                    this.setState({ errorsTotal: [] });
                    this.props.dispatch(resetErrors());
                }
                if (errInfo.length > 0) {
                    this.calcObjectUploadDone(false, errInfo.length);
                }
            },
        );
    };

    setTotal = (type, len, objectId, lineId, content, id, objectName, lineName) => {
        if (!this.state.authSession) {
            alert("Вы не авторизованы.");
            window.location.href = "/agent/login";
            return null;
        }
        if (len > 0 && !this.state.uploadRun) {
            let totalLoadType = {
                object: objectId,
                line: lineId,
                type,
                total: len,
                content,
                id,
                objectName,
                lineName,
            };
            if (type === "stream") {
                if (this.state.streamUpload.length > 0) {
                    alert("В данной ячейке контент на загрузку уже есть.");
                    return null;
                }
                this.props.dispatch(setTotal(len));
                totalLoadType = {
                    type,
                    total: len,
                    content,
                };
                this.setState(
                    (state) => ({
                        streamUpload: state.streamUpload.concat(totalLoadType),
                        dropMode: true,
                    }),
                );
                return null;
            }
            if (type === "timelapse") {
                if (this.state.timelapseUpload.length > 0) {
                    alert("В данной ячейке контент на загрузку уже есть.");
                    return null;
                }
                this.props.dispatch(setTotal(len));
                totalLoadType = {
                    type,
                    total: len,
                    content,
                };
                this.setState(
                    (state) => ({
                        timelapseUpload: state.timelapseUpload.concat(totalLoadType),
                        dropMode: true,
                    }),
                );
                return null;
            }
            this.props.dispatch(setTotal(len));
            if (this.state.selectItems.uuid.includes(id)) {
                const indexFromChangedArray = this.state.selectItems.uuid.findIndex((uid) => id === uid);
                const newTotal = this.state.selectItems.total;
                const newTotalUpload = this.state.totalUpload;
                newTotal.splice(indexFromChangedArray, 1, len);
                newTotalUpload.splice(indexFromChangedArray, 1, totalLoadType);
                this.setState(
                    (state) => ({
                        countLoadContent: state.countLoadContent + len,
                        totalUpload: newTotalUpload,
                        selectItems: {
                            ...state.selectItems,
                            total: newTotal,
                        },
                    }),
                );
                return null;
            }
            this.setState(
                (state) => ({
                    totalUpload: state.totalUpload.concat(totalLoadType),
                    countLoadContent: state.countLoadContent + len,
                    dropMode: true,
                    selectItems: {
                        ...state.selectItems,
                        uuid: state.selectItems.uuid.concat(id),
                        total: state.selectItems.total.concat(len),
                    },
                }),
            );
        }
        return null;
    };

    handleFileUpload = (arr, type, objectId, lineId, id, objectName, lineName) => {
        if (this.state.uploadRun) {
            alert("Дождитесь окончания загрузки");
            return null;
        }
        if (arr.length === 0) {
            alert("Не верный формат контента");
            return null;
        }
        if (this.state.selectItems.uuid.includes(id) && !this.state.reUpload) {
            alert("Файлы не будут добавлены. Необходимо вложить в ячейку сет целиком.\nНажмите кнопку Очистить и повторите процедуру.");
            return null;
        }
        if (objectId === 1 && lineId === 1 && type === "AERIAL") {
            const example = ["1.", "2.", "3.", "4.", "5.", "6.", "7."];
            const name = arr.every((el) => example.includes(el.name.trim().slice(0, 2)));
            const nameLength = arr.every((el) => el.name.length === 5);
            if (name && nameLength) {
                this.props.dispatch(resetData());
                const sizeCheck = arr.every((el) => el.size > 0);
                if (sizeCheck) {
                    this.setTotal(type, arr.length, objectId, lineId, arr, id, objectName, lineName);
                    return null;
                }
                alert("В данной загрузке есть файлы с нулевым размером. Проверьте.");
                return null;
            }
            alert("Не правильно именован один из загружаемых файлов.\nИсправьте и повторите загрузку.");
            this.clearLoadContent();
            return null;
        }
        this.props.dispatch(resetData());
        const sizeCheck = arr.every((el) => el.size > 0);
        if (sizeCheck) {
            this.setTotal(type, arr.length, objectId, lineId, arr, id, objectName, lineName);
            return null;
        }
        alert("В данной загрузке есть файлы с нулевым размером. Проверьте.");
    };

    runLoadContent = () => {
        if (this.state.uploadRun) {
            return null;
        }
        if (this.state.checkUploadEventBlock) {
            this.setState({
                uploadRun: true,
                newUploadRun: false,
                reUpload: false,
                uploadEventBlock: true,
            });
            this.state.totalUpload.forEach((load) => {
                this.props.dispatch(addData(load));
            });
            return null;
        }
        if (!this.state.checkUploadEventBlock) {
            this.setState({
                uploadRun: true,
                newUploadRun: false,
                reUpload: false,
                uploadEventBlock: false,
            });
            this.state.totalUpload.forEach((load) => {
                this.props.dispatch(addData(load));
            });
            return null;
        }
    };

    changeBGHeader = (val) => {
        this.setState({ bgState: val });
    };

    calcObjectUploadDone = (err = true, errInfo, reFetch) => {
        if (this.props.progress === this.state.doneProgress) {
            if (err) {
                this.setState(
                    () => ({ reportMode: true, bgState: "success" }),
                    () => {
                        const info = (
                            <div className="info-report-migrate">
                                <p className="mb-2">
                                    Загрузка прошла успешно.
                                </p>
                            </div>
                        );
                        this.props.dispatch(setReportText(info));
                    },
                );
                return null;
            }
            if (this.state.errorsTotal.length === 0) {
                this.setState(
                    () => ({ reportMode: true, bgState: "warning" }),
                    () => {
                        const info = (
                            <div
                                style={{ fontSize: "0.9rem" }}
                                className="info-report-migrate">
                                <p className="m-0">
                                    Файлы загружены, но по техническим причинам не отправлены на свервер.
                                </p>
                                <div className="report-box-alert">
                                    <p className="m-0">Нажмите для повторной отправки данных: </p>
                                    <Button
                                        disMode={false}
                                        styles="resubmit"
                                        classes="btn ml-3 btn-sm"
                                        handleFunc={reFetch}>
                                        <img
                                            className="upload-img"
                                            src={reupload}
                                            alt="Reload" />
                                    </Button>
                                </div>
                            </div>
                        );
                        this.props.dispatch(setReportText(info));
                    },
                );
                return null;
            }
        }
        if (errInfo > 0) {
            this.setState(
                () => ({ reportMode: true, bgState: "alert" }),
                () => {
                    const info = (
                        <div className="info-report-migrate">
                            <p className="m-0">
                                Некоторые файлы не загрузились.
                            </p>
                            {
                                !this.state.chunksUploadMode ? (
                                    <p>Повтор загрузки данных</p>
                                ) : (
                                    <div>
                                        <p className="m-0 p-0">
                                            Сбой отправки. Проверьте логи и обратитесь к администратору.
                                        </p>
                                        <p className="m-0 p-0">
                                            Затем данную страницу можно обновить.
                                        </p>
                                    </div>
                                )
                            }
                        </div>
                    );
                    this.props.dispatch(setReportText(info));
                },
            );
            return null;
        }
    };

    handleCollects = (val) => {
        this.setState((state) => ({ doneProgress: state.doneProgress + val }));
    };

    takeUploadEventBlock = (val) => this.setState({ uploadEventBlock: val });

    takeCheckUploadEventBlock = (val) => this.setState({ checkUploadEventBlock: val });

    handleLogOut = () => {
        const answer = confirm("Подтвердите выход из учетной записи.");
        if (answer) {
            fetchRequest("get", "/agent/api/logout")
                .then((res) => {
                    if (res.data.success) {
                        window.location.href = "/";
                    }
                });
        }
        return null;
    };

    clearLoadContent = (exception) => {
        this.setState({
            uploadRun: false,
            totalUpload: [],
            streamUpload: [],
            timelapseUpload: [],
            selectItems: {
                uuid: [],
                total: [],
            },
            done: 0,
            countLoadContent: 0,
            dropMode: false,
            newUploadRun: true,
            reportMode: false,
            reSubmitUpload: false,
            doneProgress: 0,
            errorsTotal: [],
            bgState: "default",
            chunksUploadMode: false,
            uploadEventBlock: false,
            checkUploadEventBlock: false,
        });
        const arr = [
            resetTotal,
            resetDone,
            resetReportText,
            resetErrors,
            resetData,
        ].filter((except) => except !== exception);
        this.props.dispatches(arr);
    };

    forceUploadRun = (val) => this.setState({ uploadRun: val });

    toggleModal = () => this.setState((state) => ({ showLogs: !state.showLogs }));

    setChunkMode = () => this.setState((state) => ({ chunksUploadMode: !state.chunksUploadMode }));

    forceSetChunkMode = (val) => this.setState({ chunksUploadMode: val });

    clearItemContent = (uuid) => {
        const { totalUpload, selectItems } = this.state;
        const index = totalUpload.findIndex((elem) => elem.id === uuid);
        if (index >= 0) {
            const item = totalUpload[index];
            this.props.dispatch(changeTotal(item.total));
            const newElTotal = totalUpload;
            const newElTot = selectItems.total;
            const newUuid = selectItems.uuid;
            newElTotal.splice(index, 1);
            newElTot.splice(index, 1);
            newUuid.splice(index, 1);
            this.setState(
                (state) => ({
                    countLoadContent: state.countLoadContent - item.total,
                    totalUpload: newElTotal,
                    selectItems: {
                        ...state.selectItems,
                        total: newElTot,
                        uuid: newUuid,
                    },
                }),
                this.checkDropMode,
            );
        }
    };

    clearItemContentLapse = () => {
        const { timelapseUpload } = this.state;
        if (timelapseUpload.length > 0) {
            this.props.dispatch(changeTotal(timelapseUpload[0].total));
            this.setState({
                timelapseUpload: [],
            }, this.checkDropMode);
        }
    };

    clearItemContentStream= () => {
        const { streamUpload } = this.state;
        if (streamUpload.length > 0) {
            this.props.dispatch(changeTotal(streamUpload[0].total));
            this.setState({
                streamUpload: [],
            }, this.checkDropMode);
        }
    };

    checkDropMode = () => {
        const {
            totalUpload, timelapseUpload, streamUpload, checkUploadEventBlock,
        } = this.state;
        if (totalUpload.length > 0 || timelapseUpload.length > 0 || streamUpload.length > 0 || checkUploadEventBlock) {
            this.setState({ reUpload: true, dropMode: true });
            return null;
        }
        this.setState({ reUpload: false, dropMode: false });
    };

    render() {
        const {
            date, uploadRun, newUploadRun, reportMode, reSubmitUpload,
            errorsTotal, bgState, showDate, dropMode, showLogs, reUpload,
        } = this.state;
        return (
            <div className="agent-page-wrapper">
                <div
                    style={panelBg[bgState]}
                    className="row agent-page-control-panel">
                    <div className="agent-page-header-control col-11 col-sm-12">
                        <div className="col-3">
                            <div className="agent-header_btn-group">
                                <Button
                                    handleFunc={this.handleLogOut}
                                    styles="logout"
                                    classes="btn btn-sm btn-logout col-4 btn_with_icon">
                                    Выйти
                                    <img
                                        className="agent_btn_icons"
                                        src={exitIcon}
                                        alt="exit icon" />
                                </Button>
                                <Button
                                    styles="default"
                                    handleFunc={this.toggleModal}
                                    classes="btn btn-sm btn-log_error col-4 btn_with_icon">
                                    Логи
                                    <img
                                        className="agent_btn_icons"
                                        src={logIcon}
                                        alt="exit icon" />
                                </Button>
                            </div>
                            <div
                                className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <img
                                            src={calendar}
                                            alt="Calendar" />
                                    </span>
                                </div>
                                <input
                                    className="form-control text-center"
                                    type="date"
                                    defaultValue={date}
                                    disabled={!showDate}
                                    onChange={this.handleChangeDate} />
                            </div>
                        </div>
                        <div className="info-done-block col-9 text-center">
                            <ReportDesk
                                {...this.state}
                                total={this.props.progress}
                                report={this.props.report}
                                setChunkMode={this.setChunkMode}>
                                {
                                    (uploadRun && reportMode && !newUploadRun && !reSubmitUpload &&
                                        (this.props.progress === this.state.doneProgress)) && (
                                        <div className="row">
                                            <Button
                                                styles="default"
                                                disMode={errorsTotal.length > 0}
                                                classes="btn btn-sm w-25 ml-auto mr-auto col-5 btn_with_icon"
                                                handleFunc={this.clearLoadContent}>
                                                Новая загрузка
                                                <img
                                                    className="agent_btn_icons"
                                                    src={recycleIcon}
                                                    alt="New upload icon" />
                                            </Button>
                                        </div>
                                    )
                                }
                            </ReportDesk>
                            <div className="btn-group-request col-2">
                                {
                                    ((!reportMode && uploadRun) || (this.props.errors.length > 0 && uploadRun)) ? (
                                        <Spin />) : (
                                        <React.Fragment>
                                            <Button
                                                disMode={(!dropMode && !uploadRun && !reUpload)
                                                || reportMode ? 1 : false}
                                                classes="btn btn-sm mb-2 btn_with_icon"
                                                styles="default"
                                                handleFunc={this.clearLoadContent}>
                                                Очистить
                                                <img
                                                    className="agent_btn_icons"
                                                    src={recycleIcon}
                                                    alt="clear icon" />
                                            </Button>
                                            <Button
                                                disMode={(!dropMode && !reUpload) || reportMode ? 1 : false}
                                                classes="btn btn-sm btn_with_icon"
                                                styles="default"
                                                handleFunc={this.runLoadContent}>
                                                Загрузить
                                                <img
                                                    className="agent_btn_icons"
                                                    src={downloadIcon}
                                                    alt="clear icon" />
                                            </Button>
                                        </React.Fragment>)
                                }
                            </div>
                            <div className="col-1" />
                        </div>
                    </div>
                </div>
                <div className="agent_drop-body-box">
                    <div className="agent_drop-timelapse_stream row">
                        <div className="col-12">
                            <div className="row no-gutters">
                                <ContentLoadStream
                                    {...this.state}
                                    clearItemContentStream={this.clearItemContentStream}
                                    clearLoadContent={this.clearLoadContent}
                                    fetchUploadedStream={this.fetchUploadedStream}
                                    disactiveDate={this.disactiveDate}
                                    changeBGHeader={this.changeBGHeader}
                                    handleCollects={this.handleCollects}
                                    handleFileUpload={this.handleFileUpload}
                                    changeUploadStatus={this.changeUploadStatus} />
                                <ContentLoadTimelapse
                                    {...this.state}
                                    clearItemContentLapse={this.clearItemContentLapse}
                                    clearLoadContent={this.clearLoadContent}
                                    fetchUploadedTimelapse={this.fetchUploadedTimelapse}
                                    disactiveDate={this.disactiveDate}
                                    changeBGHeader={this.changeBGHeader}
                                    handleCollects={this.handleCollects}
                                    handleFileUpload={this.handleFileUpload}
                                    changeUploadStatus={this.changeUploadStatus} />
                            </div>
                        </div>
                    </div>
                    <div
                        className="row h-100">
                        <div className="col-12 h-100">
                            <ContentLoad
                                {...this.state}
                                clearItemContent={this.clearItemContent}
                                clearLoadContent={this.clearLoadContent}
                                disactiveDate={this.disactiveDate}
                                changeBGHeader={this.changeBGHeader}
                                handleCollects={this.handleCollects}
                                handleFileUpload={this.handleFileUpload}
                                changeUploadStatus={this.changeUploadStatus} />
                        </div>
                    </div>
                    <Modal
                        showLogs={showLogs}
                        toggleModal={this.toggleModal} />
                </div>
            </div>
        );
    }
}

export default connect(
    (state) => ({
        errors: state.errors,
        progress: state.progress,
        date: state.date,
        report: state.report,
    }),
    (dispatch) => ({
        dispatch: (value) => {
            dispatch(value);
        },
        dispatches: (array) => {
            array.forEach((el) => {
                dispatch(el());
            });
        },
    }),
)(AgentPage);
