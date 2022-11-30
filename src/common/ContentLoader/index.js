import React from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import SiteLoader from "../SiteLoader";
import ProgressLoader from "../ProgressLoader";
import "./style.css";

const ContentLoader = ({ loaded, progress }) => {
    return (
        <div className={classNames(
            "content-loader",
            {
                "content-load__off": loaded,
                "content-load__on": !loaded,
            },
        )}>
            <SiteLoader />
            {Number(progress) > 0 && <ProgressLoader progress={progress} />}
        </div>
    );
};

ContentLoader.propTypes = {
    loaded: PropTypes.bool,
    progress: PropTypes.number,
};

export default ContentLoader;
