import React from "react";
import * as PropTypes from "prop-types";
import axios from "axios";

import { Card, CardBody, Progress } from "reactstrap";
import VideoPlayer from "../../../common/VideoPlayer";

const uploadUrl = (companyID, type) => `/admin/api/companyContent/${companyID}/${type}/video`;

class PromoPreview extends React.Component {
    static propTypes = {
        handleDone: PropTypes.func.isRequired,
        file: PropTypes.object.isRequired,
    };

    state = {
        src: null,
        progress: 0,
        fileToBig: false,
    };

    config = {
        onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            this.setState({ progress });
        },
    };

    submitFileUpload = () => {
        const {
            index, file, handleDone, currentCompany, section,
        } = this.props;
        const body = new FormData();
        body.append("file", file);
        body.append("date", moment(new Date()).format("YYYY-MM-DD"));
        axios
            .post(uploadUrl(currentCompany.id, section), body, this.config)
            .then(({ data }) => {
                if (data.success) {
                    handleDone(index);
                }
            })
            .catch((e) => {
                warn(e, "upload err");
                handleDone(index);
            });
    };

    componentDidMount = () => {
        const { file } = this.props;
        if (file) {
            if (file.size < 1000000) {
                const reader = new FileReader();
                reader.onload = function readerOnload(e) {
                    this.setState({ src: e.target.result }, () => this.submitFileUpload());
                }.bind(this);
                reader.readAsDataURL(file);
            } else {
                this.setState({ fileToBig: true }, () => this.submitFileUpload());
            }
        }
    };

    render() {
        const { progress, src, fileToBig } = this.state;
        return (
            <Card>
                <CardBody className="image-thumb image-thumb_video">
                    {fileToBig ? <span>Файл слишком большой для предпросмотра</span> : (
                        <VideoPlayer
                            className="VideoPreview"
                            src={src} />
                    )}
                </CardBody>
                {progress > 0 && progress <= 100 ? (
                    <Progress
                        className="ProgressBar"
                        value={progress} />
                ) : null}
            </Card>
        );
    }
}

export default PromoPreview;
