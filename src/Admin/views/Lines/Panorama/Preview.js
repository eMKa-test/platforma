import React from "react";
import * as PropTypes from "prop-types";
import {
    Col, Card, CardBody, Progress,
} from "reactstrap";

import axios from "axios";

class Preview extends React.Component {
    static propTypes = {
        handleDone: PropTypes.func.isRequired,
        uploadUrl: PropTypes.string.isRequired,
        file: PropTypes.object.isRequired,
    };

    state = {
        bg: { backgroundImage: "none" },
        progress: 0,
    };

    config = {
        onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            this.setState({ progress });
        },
    };

    submitFileUpload = () => {
        const {
            index, file, uploadUrl, handleDone,
        } = this.props;
        const body = new FormData();
        body.append("file", file);
        axios
            .post(uploadUrl, body, this.config)
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
        if (this.props.file) {
            if (this.props.file.size < 1000000) {
                const reader = new FileReader();
                reader.onload = function readerOnload(e) {
                    this.setState({ bg: { backgroundImage: `url('${e.target.result}')` } }, () => this.submitFileUpload());
                }.bind(this);
                reader.readAsDataURL(this.props.file);
            } else {
                this.submitFileUpload();
            }
        }
    };

    render() {
        const { progress, bg } = this.state;
        return (
            <Card>
                <CardBody className="image-thumb image-thumb_small"
                    style={bg} />
                {progress > 0 && progress <= 100 ? <Progress className="ProgressBar"
                    value={progress} /> : null}
            </Card>
        );
    }
}

export default Preview;
