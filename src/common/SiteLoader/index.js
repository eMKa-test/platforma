import React from "react";
import * as PropTypes from "prop-types";
import "./style.css";

const SiteLoader = () => (
    <div id="site-loader-inner" className="site-loader__wrapper-inner">
        <div className="site-loader-inner">
            <svg className="circular-inner"
                viewBox="25 25 50 50">
                <circle className="path-inner"
                    cx="50"
                    cy="50"
                    r="20"
                    fill="none"
                    strokeWidth="2"
                    strokeMiterlimit="10" />
            </svg>
        </div>
    </div>
);

SiteLoader.propTypes = {
    size: PropTypes.number,
    radius: PropTypes.number,
}

export default SiteLoader;
