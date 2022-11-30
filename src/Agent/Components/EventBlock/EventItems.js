import React from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import {
    Progress, Card, CardBody, CardFooter,
} from "reactstrap";
import Dropzone from "react-dropzone";
import LoadInfo from "../LoadInfo";
import { CHUNK_SIZE, REPEAT_TIME } from "../../constants";
import {
    setTotal, changeTotal, resetErrors, setError,
} from "../../store/actions/ActionsCreator";

function fetchRequest(method, url, params, config, flag = false) {
    if (!flag) {
        return axios[method](url, params, config);
    }
    throw new Error("Network Error");
}

function uploadAsChunk(file, uuid,
    {
        date, type,
    },
    callNextItem, errorCollect) {
    const fileSize = file.size;
    let offset = 0;
    let chunkReaderBlock = null;

    const readEventHandler = function countChunks(evt) {
        const prevOffset = offset;
        if (evt.target.error == null) {
            offset += evt.target.result.length;
            const param = new FormData();
            param.append("uid", uuid);
            param.append("fileName", file.name);
            param.append("date", date);
            param.append("type", type);
            param.append("data", evt.target.result);
            param.append("chunk", evt.target.result.length);
            param.append("chunkTotal", prevOffset);
            param.append("fileSize", fileSize);
            fetchRequest("post", "/agent/api/content/uploadedEvents/", param)
                .then(({ data }) => {
                    if (data.success) {
                        if (offset >= fileSize) {
                            // console.log("Done reading file");
                            callNextItem();
                            return;
                        }
                        chunkReaderBlock(offset, CHUNK_SIZE, file);
                    }
                })
                .catch((e) => {
                    // console.log("Перечанкинг");
                    if (e.message === "Network Error") {
                        offset -= evt.target.result.length;
                        chunkReaderBlock(prevOffset, CHUNK_SIZE, file);
                    }
                    if (e.response) {
                        if (e.response.data.error === "authenticationFailed") {
                            alert("Вы не авторизованы.");
                            window.location.href = "/agent/login";
                            return null;
                        }
                    }
                    errorCollect(e);
                });
        } else {
            console.log(`Read error: ${evt.target.error}`);
        }
    };
    chunkReaderBlock = function processChunks(_offset, length, _file) {
        const r = new FileReader();
        const blob = _file.slice(_offset, length + _offset);
        r.onload = readEventHandler;
        r.readAsBinaryString(blob);
    };
    chunkReaderBlock(offset, CHUNK_SIZE, file);
}

class EventItems extends React.Component {
    state = {
        attempt: 0,
        content: [],
        currentLoadDone: false,
        errorsContent: [],
        progress: 0,
        reUpload: false,
        total: 0,
    }

    componentDidUpdate(prevProps, prevState) {
        const { uploadEventBlock, uploadRun, clearAllEvents, dropMode, massProgress } = this.props;
        if (prevProps.uploadRun !== uploadRun && uploadRun && uploadEventBlock && !this.props.chunksUploadMode) {
            this.formFetch();
        }
        if (prevProps.chunksUploadMode !== this.props.chunksUploadMode && this.props.chunksUploadMode) {
            this.resetAttempt();
        }
        if (prevProps.clearAllEvents !== clearAllEvents && clearAllEvents) {
            this.clearFromEvent();
        }
        // if (prevProps.clearAllEvents !== clearAllEvents && clearAllEvents && massProgress === 0) {
        //     this.clearFromEvent(false);
        // }
        if (prevState.total < this.state.total && this.props.eventName) {
            this.props.takeCheckUploadEventBlock(true);
        }
        if (prevProps.dropMode !== dropMode && !dropMode) {
            this.clearFromEvent(false);
        }
    }

    formFetch = () => {
        const { chunksUploadMode } = this.props;
        if (chunksUploadMode) {
            this.chunkSubmitUploadRequest();
            return null;
        }
        this.submitUploadRequest();
    }

    handleFileUpload = (arr) => {
        const { total } = this.state;
        if (arr.length === 0) {
            alert("Не верный формат контента");
            return null;
        }
        if (this.props.uploadRun) {
            alert("Дождитесь окончания загрузки");
            return null;
        }
        const sizeCheck = arr.every((el) => el.size > 0);
        if (!sizeCheck) {
            alert("В данной загрузке есть файлы с нулевым размером. Проверьте.");
            return null;
        }
        if (total > 0) {
            alert("Файлы не будут добавлены. Необходимо вложить в ячейку сет целиком.\nНажмите кнопку Очистить и повторите процедуру.");
            return null;
        }
        this.setState((state) => ({
            content: state.content.concat(arr),
            total: arr.length,
        }), () => {
            this.props.dispatch(setTotal(arr.length));
            this.props.setCountContent(arr.length);
        });
    }

    clearFromEvent = (flag = true) => {
        const { total } = this.state;
        this.setState(
            () => {
                if (flag) {
                    this.props.setCountContent(-total);
                    this.props.dispatch(changeTotal(total));
                }
                if (this.props.massContent - total === 0) {
                    this.props.takeCheckUploadEventBlock(false);
                }
                if (!this.props.eventName) {
                    this.props.takeCheckUploadEventBlock(false);
                }
                this.props.setClearAllEvents(false);
            },
            () => {
                this.setState({
                    content: [],
                    total: 0,
                    progress: 0,
                    currentLoadDone: false,
                    errorsContent: [],
                });
            },
        );
    }

    resetAttempt = () => this.setState({ attempt: 0 })

    chunkSubmitUploadRequest = () => {
        const { progress } = this.state;
        const { type } = this.props;
        const uuid = `EVENTS_${type}_${moment().format("x")}`;
        if (this.state.content[progress]) {
            uploadAsChunk(this.state.content[progress], uuid, this.props, this.callNextItem, this.errorCollect);
        } else {
            console.log("Нет файла для загрузки");
        }
    }

    callNextItem = () => {
        const { total } = this.state;
        const { eventName } = this.props;
        this.setState(
            (state) => ({ progress: state.progress + 1 }),
            () => {
                this.props.handleCollects(1);
                this.props.changeBGHeader("default");
                if (this.state.progress !== total) {
                    this.chunkSubmitUploadRequest();
                    return null;
                }
                this.setState(
                    () => ({
                        progress: total, total, currentLoadDone: true, reUpload: false,
                    }),
                );
                this.props.changeUploadStatus(0, [], true);
                this.props.fetchUploadedEvent({ eventName });
            },
        );
    }

    repeatUpload = () => {
        this.setState(
            (state) => ({
                content: state.content.map((el, i) => {
                    if (i >= state.progress) return el;
                }).filter((element) => element !== undefined),
                reUpload: false,
                currentLoadDone: false,
            }),
            () => {
                this.submitUploadRequest();
            },
        );
    }

    async submitUploadRequest() {
        const { content } = this.state;
        const {
            type, eventName, massContent,
        } = this.props;
        // eslint-disable-next-line
        for (let file of content) {
            const param = new FormData();
            param.append("type", type);
            param.append("file", file);
            try { // eslint-disable-next-line
                await fetchRequest("post", "/agent/api/content/uploadedEvents/", param)
                    .then((res) => {
                        if (res.data.success) {
                            this.props.changeBGHeader("default");
                            this.setState(
                                (state) => ({
                                    progress: state.progress + 1,
                                }),
                            );
                            this.props.countMassProgress(1);
                            this.props.handleCollects(1);
                            return res;
                        }
                    });
            } catch (e) {
                if (e.message === "Network Error") {
                    const errorEvent = {
                        error: {
                            errorMsg: e.message,
                        },
                        time: moment(new Date()).format("HH:mm:ss DD/MM/YY"),
                        type: `EVENTS_${type}`,
                        errorType: "Network Error",
                    };
                    if (!this.props.chunksUploadMode) {
                        this.setState(
                            (state) => ({
                                errorsContent: state.errorsContent.concat([e]),
                                reUpload: true,
                                attempt: state.attempt + 1,
                            }),
                            () => {
                                this.props.dispatch(setError(errorEvent));
                                this.props.changeUploadStatus(0, this.state.errorsContent);
                                setTimeout(() => {
                                    this.repeatUpload();
                                }, REPEAT_TIME);
                            },
                        );
                    } else {
                        this.chunkSubmitUploadRequest();
                    }
                    break;
                }
                if (e.response.data.error === "authenticationFailed") {
                    alert("Вы не авторизованы.");
                    window.location.href = "/agent/login";
                    break;
                }
                const errorEvent = {
                    error: {
                        status: e.response.status,
                        errorMsg: e.response.statusText,
                        access: e.response.data,
                    },
                    time: moment(new Date()).format("HH:mm:ss DD/MM/YY"),
                    type,
                };
                this.setState(
                    (state) => ({
                        errorsContent: state.errorsContent.concat(e),
                        reUpload: true,
                    }),
                    () => {
                        this.props.dispatch(setError(errorEvent));
                        this.props.changeUploadStatus(0, this.state.errorsContent);
                    },
                );
                if (e.response.status === 500) {
                    alert("Сбой отправки. Отправьте логи администратору и обновите страницу.");
                    this.props.clearLoadContent(resetErrors);
                }
                break;
            }
        }
        if (this.state.total > 0 && this.state.progress === this.state.total) {
            this.setState(
                { currentLoadDone: true },
                () => {
                    this.props.changeUploadStatus(0, [], true);
                    const params = {
                        eventName,
                        total: massContent,
                        progress: this.props.massProgress,
                    };
                    this.props.fetchUploadedEvent(params);
                },
            );
        }
        return null;
    }

    errorCollect = (e) => {
        if (e.message === "Network Error") {
            const errorEvent = {
                error: {
                    errorMsg: e.message,
                },
                time: moment(new Date()).format("HH:mm:ss DD/MM/YY"),
                type: `EVENTS_${this.props.type}`,
                errorType: "Network Error",
            };
            this.setState(
                (state) => ({
                    errorsContent: state.errorsContent.concat([e]),
                    reUpload: true,
                }),
                () => {
                    this.props.dispatch(setError(errorEvent));
                    this.props.changeUploadStatus(0, this.state.errorsContent);
                },
            );
            return null;
        }
        if (e.response) {
            if (e.response.data.error === "authenticationFailed") {
                alert("Вы не авторизованы.");
                window.location.href = "/agent/login";
                return null;
            }
            if (e.response.status === 500) {
                const errorEvent = {
                    error: {
                        errorMsg: e.message,
                    },
                    time: moment(new Date()).format("HH:mm:ss DD/MM/YY"),
                    object: null,
                    line: null,
                    type: "EVENTS",
                    errorType: "Network Error",
                };
                this.setState(
                    (state) => ({
                        errorsContent: state.errorsContent.concat([e]),
                        reUpload: true,
                    }),
                    () => {
                        this.props.dispatch(setError(errorEvent));
                        this.props.changeUploadStatus(0, this.state.errorsContent);
                    },
                );
                alert("Сбой отправки. Отправьте логи администратору и обновите страницу.");
                this.props.clearLoadContent(resetErrors);
            }
            return null;
        }
        const errorEvent = {
            error: {
                status: e.response.status,
                errorMsg: e.response.statusText,
                access: e.response.data,
            },
            time: moment(new Date()).format("HH:mm:ss DD/MM/YY"),
            object: null,
            line: null,
            type: "EVENTS",
        };
        this.setState(
            (state) => ({
                errorsContent: state.errorsContent.concat(e),
                reUpload: true,
            }),
            () => {
                this.props.dispatch(setError(errorEvent));
                this.props.changeUploadStatus(0, this.state.errorsContent);
            },
        );
    }

    render() {
        const {
            accept,
            nameItem,
            type,
        } = this.props;
        const { total, progress } = this.state;
        let calcVal = 0;
        if (total > 0) {
            calcVal = Number((progress / total * 100).toFixed(0));
        }
        return (
            <Card>
                <CardBody>
                    <Dropzone
                        className={`agent_event-upload ${total > 0 ? "check_will_upload" : "uncheck_upload"}`}
                        activeClassName="agent_event-upload--active"
                        acceptClassName="agent_event-upload--accept"
                        rejectClassName="agent_event-upload--reject"
                        accept={accept}
                        onDrop={(e) => this.handleFileUpload(e, type)}>
                        <p className="mb-0">
                            {nameItem}
                        </p>
                    </Dropzone>
                    <LoadInfo
                        id={type}
                        handleFunc={this.clearFromEvent}
                        {...this.props}
                        {...this.state} />
                </CardBody>
                <CardFooter>
                    <Progress
                        className="agent_event-progress"
                        animated={progress < total ? true : false}
                        color={`${progress < total ? "primary" : "success"}`}
                        value={calcVal} />
                </CardFooter>
            </Card>
        );
    }
}

EventItems.propTypes = {
    uploadRun: PropTypes.bool.isRequired,
    massContent: PropTypes.number,
    massProgress: PropTypes.number,
    chunksUploadMode: PropTypes.bool.isRequired,
    eventName: PropTypes.string.isRequired,
    dropMode: PropTypes.bool.isRequired,
    clearAllEvents: PropTypes.bool.isRequired,
    countMassProgress: PropTypes.func.isRequired,
    takeCheckUploadEventBlock: PropTypes.func.isRequired,
    clearLoadContent: PropTypes.func.isRequired,
    uploadEventBlock: PropTypes.bool.isRequired,
    setCountContent: PropTypes.func.isRequired,
    setClearAllEvents: PropTypes.func.isRequired,
    dispatch: PropTypes.func,
    fetchUploadedEvent: PropTypes.func,
    changeUploadStatus: PropTypes.func,
    changeBGHeader: PropTypes.func.isRequired,
    handleCollects: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    nameItem: PropTypes.string.isRequired,
    accept: PropTypes.string.isRequired,
};

export default connect(
    () => ({}),
    (dispatch) => ({
        dispatch: (val) => {
            dispatch(val);
        },
    }),
)(EventItems);
