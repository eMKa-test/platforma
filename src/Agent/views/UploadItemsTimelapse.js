import React, { Component } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import Dropzone from "react-dropzone";
import { Card, CardBody, CardFooter, Progress } from "reactstrap";
import LoadInfo from "../Components/LoadInfo";

import { CHUNK_SIZE } from "../constants";

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
    { date, type },
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
            param.append("projectId", "");
            param.append("lineId", "");
            param.append("date", date);
            param.append("type", type);
            param.append("data", evt.target.result);
            param.append("chunk", evt.target.result.length);
            param.append("chunkTotal", prevOffset);
            param.append("fileSize", fileSize);
            fetchRequest("post", "/agent/api/content/timelapse/", param)
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

class UploadItemsTimelapse extends Component {
    state={
        progress: 0,
        total: 0,
        content: [],
        currentLoadDone: false,
        errorsContent: [],
        reUpload: false,
        fatProgress: 0,
        attempt: 0,
    }

    componentDidUpdate(prevProps) {
        if (this.state.content.length !== this.props.content.length && this.props.uploadRun && this.state.attempt === 0 && !this.props.chunksUploadMode) {
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
        if (chunksUploadMode) {
            this.setState({
                content: this.props.content,
            }, this.chunkSubmitUploadRequest);
            return null;
        }
        this.setState(
            () => ({ content: [] }),
            () => {
                this.setState({ content: this.props.content });
                this.submitUploadRequest();
            },
        );
    }

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

    setNewStateProgress = () => this.setState({
        progress: 0, total: 0, currentLoadDone: false, errorsContent: [], fatProgress: 0, content: [],
    });

    setConfig = (len) => {
        return ({
            onUploadProgress: (prog) => {
                if (this.state.progress < len) {
                    this.setState({ fatProgress: Number((prog.loaded / prog.total * 100).toFixed(0)) });
                }
            },
        });
    }

    chunkSubmitUploadRequest = () => {
        const { progress } = this.state;
        const { content } = this.props;
        const uuid = `TIMELAPSE_${moment().format("x")}`;
        if (content[progress]) {
            uploadAsChunk(content[progress], uuid, this.props, this.callNextItem, this.errorCollect);
        } else {
            console.log("Нет файла");
        }
    }

    callNextItem = () => {
        const { total } = this.props;
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
                        progress: total, total, currentLoadDone: true, reUpload: false, fatProgress: 100,
                    }),
                );
                this.props.changeUploadStatus(0, [], true);
                this.props.fetchUploadedTimelapse();
            },
        );
    }

    resetAttempt = () => this.setState({ attempt: 0 })

    errorCollect = (e) => {
        if (e.message === "Network Error") {
            const errorEvent = {
                error: {
                    errorMsg: e.message,
                },
                time: moment(new Date()).format("HH:mm:ss DD/MM/YY"),
                object: null,
                line: null,
                type: "TIMELAPSE",
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
                    type: "TIMELAPSE",
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
            object: null,
            line: null,
            type: "TIMELAPSE",
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
        const { total } = this.props; // eslint-disable-next-line
        for (let file of this.state.content) {
            const param = new FormData();
            param.append("file", file);
            try { // eslint-disable-next-line
                await fetchRequest("post", "/agent/api/content/timelapse/", param, this.setConfig(total))
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
                        object: null,
                        line: null,
                        type: "TIMELAPSE",
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
                                }, 1500);
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
                    object: null,
                    line: null,
                    type: "TIMELAPSE",
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
            this.props.changeUploadStatus(0, [], true);
            this.props.fetchUploadedTimelapse();
        }
    }

    setTotal = (val) => {
        this.setState({ total: val, content: [], progress: 0, fatProgress: 0 });
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
            clearItemContentLapse,
        } = this.props;
        const {
            progress, total,
        } = this.state;
        let calcVal = 0;
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(Number((progress / total * 100).toFixed(0)))) {
            calcVal = Number((progress / total * 100).toFixed(0));
        }
        return (
            <Card>
                <CardBody>
                    <Dropzone
                        id={id}
                        className={`agent_timelapse_stream-upload ${total > 0 ? "check_will_upload" : "uncheck_upload"}`}
                        activeClassName="agent_timelapse_stream-upload--active"
                        acceptClassName="agent_timelapse_stream-upload--accept"
                        rejectClassName="agent_timelapse_stream-upload--reject"
                        accept={accept}
                        onDrop={(e) => handleFileUpload(e, type, objectId, lineId, id, objectName, lineName)}>
                        <p className="mb-0">
                            {nameItem}
                        </p>
                    </Dropzone>
                    <div
                        className="d-flex flex-column justify-content-center">
                        <LoadInfo
                            handleFunc={clearItemContentLapse}
                            {...this.props}
                            {...this.state} />
                    </div>
                </CardBody>
                <CardFooter>
                    <Progress
                        animated={progress < total ? true : false}
                        color={`${progress < total ? "primary" : "success"}`}
                        value={calcVal} />
                </CardFooter>
            </Card>
        );
    }
}

UploadItemsTimelapse.propTypes = {
    uploadRun: PropTypes.bool.isRequired,
    chunksUploadMode: PropTypes.bool.isRequired,
    dropMode: PropTypes.bool.isRequired,
    content: PropTypes.array,
    nameItem: PropTypes.string,
    lineName: PropTypes.string,
    objectName: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
    accept: PropTypes.string,
    lineId: PropTypes.number,
    total: PropTypes.number,
    objectId: PropTypes.number,
    handleFileUpload: PropTypes.func,
    changeUploadStatus: PropTypes.func,
    handleCollects: PropTypes.func,
    changeBGHeader: PropTypes.func,
    fetchUploadedTimelapse: PropTypes.func,
    clearLoadContent: PropTypes.func,
    clearItemContentLapse: PropTypes.func,
};

export default connect(
    () => ({}),
    (dispatch) => ({
        dispatch: (val) => {
            dispatch(val);
        },
    }),
)(UploadItemsTimelapse);
