import React, { Component, Fragment } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import Dropzone from "react-dropzone";
import { Card, CardBody, CardFooter, Progress } from "reactstrap";
import LoadInfo from "../Components/LoadInfo";

import { CHUNK_SIZE, REPEAT_TIME } from "../constants";

import {
    resetErrors,
    setError,
} from "../store/actions/ActionsCreator";

function fetchRequest(method, url, params, config, flag = false) {
    if (!flag) {
        return axios[method](url, params, config);
    }
    throw new Error("Network Error");
}

function uploadAsChunk(file, uuid,
    {
        object, line, date, type,
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
            param.append("projectId", object);
            param.append("lineId", line);
            param.append("date", date);
            param.append("type", type);
            param.append("data", evt.target.result);
            param.append("chunk", evt.target.result.length);
            param.append("chunkTotal", prevOffset);
            param.append("fileSize", fileSize);
            fetchRequest("post", "/agent/api/content/site/", param)
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

class UploadItems extends Component {
    state = {
        type: null,
        progress: 0,
        total: 0,
        content: [],
        currentLoadDone: false,
        errorsContent: [],
        reUpload: false,
        fatProgress: 0,
        attempt: 0,
    }

    componentDidMount() {
        this.setProperties(this.props);
    }

    setProperties = ({ type }) => this.setState({ type });

    componentDidUpdate(prevProps) {
        if (this.props.content && this.state.content.length !== this.props.content.length && this.props.uploadRun && this.state.attempt === 0 && !this.props.chunksUploadMode) {
            this.formFetch();
        }
        if (prevProps.chunksUploadMode !== this.props.chunksUploadMode && this.props.chunksUploadMode) {
            this.resetAttempt();
        }
        if (this.props.total !== this.state.total) {
            this.setTotal(this.props.total);
        }
        if (this.state.currentLoadDone && this.props.dropMode !== prevProps.dropMode) {
            this.setNewStateProgress();
        }
    }

    formFetch = () => {
        const { chunksUploadMode } = this.props;
        this.setState(
            () => ({ content: [].concat(this.props.content) }),
            () => {
                if (chunksUploadMode) {
                    this.chunkSubmitUploadRequest();
                    return null;
                }
                this.submitUploadRequest();
            },
        );
    }

    setNewStateProgress = () => this.setState({
        progress: 0, total: 0, currentLoadDone: false, errorsContent: [], fatProgress: 0,
    });

    setConfig = (len) => ({
        onUploadProgress: (prog) => {
            if (this.state.progress < len) {
                this.setState({ fatProgress: Number((prog.loaded / prog.total * 100).toFixed(0)) });
            }
        },
    });

    chunkSubmitUploadRequest = () => {
        const { progress } = this.state;
        const { type, line, object } = this.props;
        const uuid = `${object}${line}${type}_${moment().format("x")}`;
        if (this.props.content[progress]) {
            uploadAsChunk(this.props.content[progress], uuid, this.props, this.callNextItem, this.errorCollect);
        } else {
            console.log("Нет файла");
        }
    }

    callNextItem = () => {
        const { total } = this.props;
        this.setState(
            (state) => ({ progress: state.progress + 1 }),
            () => {
                this.props.changeBGHeader("default");
                this.props.handleCollects(1);
                if (this.state.progress !== total) {
                    this.chunkSubmitUploadRequest();
                    return null;
                }
                this.setState(
                    () => ({
                        progress: total, total, currentLoadDone: true, reUpload: false, fatProgress: 100,
                    }),
                );
                this.props.changeUploadStatus(total, []);
            },
        );
    }

    resetAttempt = () => this.setState({ attempt: 0 })

    repeatUpload = () => {
        this.setState(
            (state) => ({
                content: this.props.content.map((el, i) => {
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

    errorCollect = (e) => {
        const { line, object, type } = this.props;
        if (e.message === "Network Error") {
            const errorEvent = {
                error: {
                    errorMsg: e.message,
                },
                time: moment(new Date()).format("HH:mm:ss DD/MM/YY"),
                object,
                line,
                type,
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
                    object,
                    line,
                    type,
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
            object,
            line,
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
    }

    async submitUploadRequest() {
        const {
            date, line, object, total, type,
        } = this.props; // eslint-disable-next-line
        for (let file of this.state.content) {
            const param = new FormData();
            param.append("file", file);
            param.append("projectId", object);
            param.append("lineId", line);
            param.append("date", date);
            param.append("type", type);
            try { // eslint-disable-next-line
                await fetchRequest("post", "/agent/api/content/site/", param, this.setConfig(total))
                    .then((res) => {
                        if (res.data.success) {
                            this.props.changeBGHeader("default");
                            this.setState(
                                (state) => ({ progress: state.progress + 1 }),
                            );
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
                        object,
                        line,
                        type,
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
                    object,
                    line,
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
                }
                break;
            }
        }
        if (this.state.progress === total) {
            this.setState(
                () => ({
                    progress: total, total, currentLoadDone: true, reUpload: false, fatProgress: 100,
                }),
            );
            this.props.changeUploadStatus(total, []);
        }
    }

    setTotal = (val) => {
        this.setState({ total: val });
    }

    render() {
        const {
            handleFileUpload,
            objectId,
            lineId,
            type,
            accept,
            nameItem,
            id,
            lineName,
            objectName,
            clearItemContent,
        } = this.props;
        const {
            progress, total, fatProgress,
        } = this.state;
        const calcVal = Number((progress / total * 100).toFixed(0));
        return (
            <Fragment>
                <Card>
                    <CardBody>
                        <Dropzone
                            id={id}
                            className={`agent_content-upload ${total > 0 ? "check_will_upload" : "uncheck_upload"}`}
                            activeClassName="agent_content-upload--active"
                            acceptClassName="agent_content-upload--accept"
                            rejectClassName="agent_content-upload--reject"
                            accept={accept}
                            onDrop={(e) => handleFileUpload(e, type, objectId, lineId, id, objectName, lineName)}>
                            <p className="mb-0">
                                {nameItem}
                            </p>
                        </Dropzone>
                        <LoadInfo
                            handleFunc={clearItemContent}
                            {...this.props}
                            {...this.state} />
                    </CardBody>
                    <CardFooter>
                        {(type !== "AERIAL") && (
                            <Progress
                                animated={progress < total ? true : false}
                                color={`${progress < total ? "primary" : "success"}`}
                                value={calcVal} />
                        )}
                        {(type === "AERIAL") && (
                            <Progress
                                animated={progress < total ? true : false}
                                color={`${progress < total ? "primary" : "success"}`}
                                value={fatProgress} />
                        )}
                    </CardFooter>
                </Card>
            </Fragment>
        );
    }
}

UploadItems.propTypes = {
    uploadRun: PropTypes.bool.isRequired,
    dropMode: PropTypes.bool.isRequired,
    chunksUploadMode: PropTypes.bool.isRequired,
    content: PropTypes.array,
    nameItem: PropTypes.string,
    lineName: PropTypes.string,
    objectName: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
    accept: PropTypes.string,
    lineId: PropTypes.number,
    line: PropTypes.number,
    object: PropTypes.number,
    total: PropTypes.number,
    objectId: PropTypes.number,
    handleFileUpload: PropTypes.func,
    changeUploadStatus: PropTypes.func,
    dispatch: PropTypes.func,
    handleCollects: PropTypes.func,
    changeBGHeader: PropTypes.func,
    clearLoadContent: PropTypes.func,
};

export default connect(
    () => ({}),
    (dispatch) => ({
        dispatch: (val) => {
            dispatch(val);
        },
    }),
)(UploadItems);
