import React from "react";
import * as PropTypes from "prop-types";
import "./style.css";

const Log = ({ param }) => {
    return (
        <div className="aero-webview-screen-log">
            {
                param ? (
                    <pre>
                        {JSON.stringify(param, null, 2)}
                    </pre>
                ) : <span>Нет входящих данных</span>
            }
        </div>
    )
};

Log.propTypes = {
    param: PropTypes.any,
};

export default Log;
