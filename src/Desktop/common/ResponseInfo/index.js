import React from "react";
import * as PropTypes from "prop-types";
import "./style.css";

const ResponseInfo = ({ open, success, title }) => (
    <div className={`admin-response-info-container ${open ? "admin-response-info-container__show" : "admin-response-info-container__hide"}`}>
        <p className={`admin-response-info-title ${success ? "response-title__success" : "response-title__error"}`}>
            {title}
        </p>
    </div>
);

ResponseInfo.propTypes = {
    open: PropTypes.bool,
    success: PropTypes.bool,
    title: PropTypes.string,
};

export default ResponseInfo;
