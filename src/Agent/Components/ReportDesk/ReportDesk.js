import React, { Fragment } from "react";
import * as PropTypes from "prop-types";

const ReportDesk = (props) => (
    <Fragment>
        <div className="info-done_date-box col-9">
            <div
                className="col-4 col-sm-5 align-self-center text-left">
                <p className="m-0 d-flex justify-content-between view_progress">
                    <span>
                        Файлов на загрузку:
                    </span>
                    <span>
                        {props.total}
                    </span>
                </p>
                <p className="info-done_total d-flex justify-content-between view_progress">
                    <span>
                        Прогресс загрузки:
                    </span>
                    <span>
                        {props.doneProgress}
                    </span>
                </p>
                <p
                    style={{ fontSize: "0.85rem" }}
                    className="mb-0 mt-2">
                    <label
                        style={{ cursor: "help" }}
                        title="При нестабильном и медленном интернете. Загрузка значительно замедлится."
                        className="d-flex justify-content-between align-items-center mb-0"
                        htmlFor="SlowNet">
                        Нестабильный интернет
                        <input
                            disabled
                            id="SlowNet"
                            className="align-middle"
                            type="checkbox"
                            onChange={() => props.setChunkMode()}
                            checked={props.chunksUploadMode} />
                    </label>
                </p>
            </div>
            <div className="col-7 info-done_report-desk">
                {props.report}
                {props.children}
            </div>
        </div>
    </Fragment>
);

ReportDesk.propTypes = {
    total: PropTypes.number,
    chunksUploadMode: PropTypes.bool,
    uploadRun: PropTypes.bool,
    setChunkMode: PropTypes.func,
    doneProgress: PropTypes.number,
    report: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    children: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.object,
    ]),
};
export default ReportDesk;
