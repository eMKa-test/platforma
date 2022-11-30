import React from "react";
import * as PropTypes from "prop-types";
import get from "lodash/get";
import {
    Button, Card, CardBody, Progress,
} from "reactstrap";
import { Prompt } from "react-router-dom";
import axios from "axios";
import Dropzone from "react-dropzone";
import SubLinesCreate from "../components/SubLinesCreate";

class Header extends React.Component {
    state = {
        upload: null,
        bg: { backgroundImage: "none" },
        progress: 0,
    }

    componentDidMount() {
        const { image } = this.props;
        if (image) {
            this.setState({ bg: { backgroundImage: `url('${image.src}')` } });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const image = get(nextProps, "image", false);
        if (image && this.state.bg.backgroundImage !== image.src) {
            this.setState({ bg: { backgroundImage: `url('${image.src}')` } });
        } else {
            this.setState({ bg: { backgroundImage: "none" } });
        }
        return null;
    }

    config = {
        onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            this.setState({ progress });
        },
    };

    handleFilePreview = (acceptedFiles) => {
        const reader = new FileReader();
        this.setState({ upload: acceptedFiles[0] });
        reader.onload = function readerOnload(e) {
            this.setState({ bg: { backgroundImage: `url('${e.target.result}')` } });
        }.bind(this);
        reader.readAsDataURL(acceptedFiles[0]);
    };

    submitFileUpload = () => {
        const upload = new FormData();
        upload.append("file", this.state.upload);
        axios
            .post(this.props.uploadUrl, upload, this.config)
            .then(({ data }) => {
                if (data.success) {
                    this.setState({ upload: null });
                }
            })
            .catch((e) => warn(e, "upload err"));
    };

    render() {
        const { upload, progress, bg } = this.state;
        const {
            onClickEdit,
            title,
            description,
            addedSublines,
            line,
            linesHeader,
            checkChangeSublines,
        } = this.props;
        return (
            <div className="row">
                <div className="col-md-7 col-xl-8">
                    <div className="d-flex align-items-center">
                        <div className="mr-3">
                            <Button
                                className="mb-2"
                                color="light"
                                onClick={onClickEdit}>
                                <i className="icon-pencil icons d-block" />
                            </Button>
                        </div>
                        <h1 className="h3 mb-2">{title}</h1>
                    </div>
                    <div>
                        <p className="mb-2 pr-3">{description}</p>
                        {
                            linesHeader && (
                                <SubLinesCreate
                                    checkChangeSublines={checkChangeSublines}
                                    line={line}
                                    addedSublines={addedSublines} />
                            )
                        }
                    </div>
                </div>
                <div className="col-md-5 col-xl-4">
                    <Card className="mb-0">
                        <CardBody
                            className="image-thumb cursor-pointer"
                            style={bg}>
                            <Dropzone
                                className="imageUpload"
                                activeClassName="imageUpload--active"
                                acceptClassName="imageUpload--accept"
                                rejectClassName="imageUpload--reject"
                                accept="image/*"
                                onDrop={this.handleFilePreview}>
                                {bg.backgroundImage === "none" && <p>Зона загрузки файла</p>}
                            </Dropzone>
                            {upload && (progress === 0 || progress === 100) ? (
                                <Button
                                    className="imageSaveBtn"
                                    color="success"
                                    onClick={this.submitFileUpload}>
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
                </div>
                <Prompt
                    when={Boolean(upload)}
                    message={() => "Вы прервете загрузку файлов, Вы уверены?"} />
            </div>
        );
    }
}

Header.propTypes = {
    onClickEdit: PropTypes.func,
    title: PropTypes.string,
    description: PropTypes.string,
    uploadUrl: PropTypes.string,
};

export default React.memo(Header);
