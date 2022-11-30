import React, { Component } from "react";
import * as PropTypes from "prop-types";
import axios from "axios";
import Dropzone from "react-dropzone";


function fetchRequest(method, url, params) {
    return axios[method](url, params)
}

class ContentLoad extends Component {
    state = {
        content: [],
        /* POST /agent/api/content/site/
        {
            file: *загружаемый файл*,
            projectId: INT,
            lineId: INT,
            date: "YYYY-MM-DD",
            type: ["IMAGE"|"VIDEO"|"PANORAMA"|"AERIAL"|"TIMELAPSE"]
        }

        */
    }

    componentDidMount() {
        // const date = new Date();
        // const toDay = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }

    // handleFileUpload = (arr, type) => {
    //     const date = moment().format("YYYY-MM-DD");
    //     const file = new FormData();
    //     file.append("file", arr[0]);
    //     const reader = new FileReader();
    //     reader.onload = function () {
    //         const param = {
    //             file,
    //             projectId: 1,
    //             lineId: 9,
    //             date,
    //             type,
    //         };
    //         fetchRequest("post", "/agent/api/content/site/", param)
    //             .then(({ data }) => {
    //                 if (data.success) {
    //                     console.log("done");
    //                 }
    //             })
    //             .catch((e) => {
    //                 warn(e, "upload err");
    //             });
    //     };
    //     reader.readAsDataURL(arr[0]);
    //     console.log(file.has("file"));
    // }

    handleFileUpload = (arr, type) => {
        const date = moment().format("YYYY-MM-DD");
        const param = {
            file: arr[0],
            projectId: 1,
            lineId: 9,
            date,
            type,
        };
        console.log(arr);
        fetchRequest("post", "/agent/api/content/site/", param)
            .then(({ data }) => {
                if (data.success) {
                    console.log("done");
                }
            })
            .catch((e) => {
                warn(e, "upload err");
            });
    }

    render() {
        return (
            <div>
                <button
                    type="button">
                    Загрузить
                </button>
                <div className="row">
                    <p className="col-5">Фото</p>
                    <div className="offset-2 col-5 cursor-pointer">
                        <Dropzone
                            className="imageUpload"
                            activeClassName="imageUpload--active"
                            acceptClassName="imageUpload--accept"
                            rejectClassName="imageUpload--reject"
                            accept="image/*"
                            onDrop={(e) => this.handleFileUpload(e, "IMAGE")}>
                            <p>Зона загрузки файла</p>
                        </Dropzone>
                    </div>
                </div>
                <div className="row">
                    <p className="col-5">Видео</p>
                    <div className="offset-2 col-5 cursor-pointer">
                        <Dropzone
                            className="imageUpload"
                            activeClassName="imageUpload--active"
                            acceptClassName="imageUpload--accept"
                            rejectClassName="imageUpload--reject"
                            accept="video/*"
                            onDrop={(e) => this.handleFileUpload(e, "VIDEO")}>
                            <p>Зона загрузки файла</p>
                        </Dropzone>
                    </div>
                </div>
                <div className="row">
                    <p className="col-5">Панорама</p>
                    <div className="offset-2 col-5 cursor-pointer">
                        <Dropzone
                            className="imageUpload"
                            activeClassName="imageUpload--active"
                            acceptClassName="imageUpload--accept"
                            rejectClassName="imageUpload--reject"
                            accept="image/*"
                            onDrop={(e) => this.handleFileUpload(e, "PANORAMA")}>
                            <p>Зона загрузки файла</p>
                        </Dropzone>
                    </div>
                </div>
                <div className="row">
                    <p className="col-5">Аэросъемка</p>
                    <div className="offset-2 col-5 cursor-pointer">
                        <Dropzone
                            className="imageUpload"
                            activeClassName="imageUpload--active"
                            acceptClassName="imageUpload--accept"
                            rejectClassName="imageUpload--reject"
                            accept="video/*"
                            onDrop={(e) => this.handleFileUpload(e, "AERIAL")}>
                            <p>Зона загрузки файла</p>
                        </Dropzone>
                    </div>
                </div>
                <img src="" alt="photo" />
            </div>
        )
    }
}

export default ContentLoad;
