import React from "react";
import get from "lodash/get";
import memoize from "lodash/memoize";
import * as PropTypes from "prop-types";
import {
    Button, Card, CardBody, Progress,
} from "reactstrap";
import Dropzone from "react-dropzone";
import axios from "axios";
import { Prompt } from "react-router-dom";

const styles = memoize((src) => {
    return { backgroundImage: src ? `url(${src})` : "none" };
});

function CompanyThumb(props) {
    const [bg, setBg] = React.useState(styles());
    const [upload, setUpload] = React.useState(null);
    const [progress, setProgress] = React.useState(0);

    const handleFilePreview = (acceptedFiles) => {
        const reader = new FileReader();
        setUpload(acceptedFiles[0]);
        reader.onload = function readerOnload(e) {
            setBg({ backgroundImage: `url('${e.target.result}')` });
        };
        reader.readAsDataURL(acceptedFiles[0]);
    };

    const submitFileUpload = async () => {
        const formData = new FormData();
        formData.append("file", upload);
        try {
            const { data } = await axios.post(`${props.uploadUrl}/upload`, formData, {
                onUploadProgress: (progressEvent) => {
                    setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                },
            });
            if (data.success) {
                setUpload(null);
            }
        } catch (e) {
            warn(e, "upload err");
        }
    };

    const current = get(props, "image.src", null);

    React.useEffect(() => {
        if (current) {
            setBg(styles(current));
        }
    }, [current]);

    return (
        <Card className="mb-0">
            <CardBody
                className="image-thumb-company cursor-pointer"
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
            </CardBody>
            {progress > 0 && progress < 100 ? (
                <Progress
                    className="ProgressBar"
                    value={progress} />
            ) : null}
            <Prompt
                when={Boolean(upload)}
                message={() => "Вы прервете загрузку файлов, Вы уверены?"} />
        </Card>
    );
};

CompanyThumb.propTypes = {
    uploadUrl: PropTypes.string.isRequired,
};

export default React.memo(CompanyThumb);
