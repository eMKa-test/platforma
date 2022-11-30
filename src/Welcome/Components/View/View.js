import React from "react";

const View = ({ children = "", className = "" }) => (
    <div className={`View ${className}`}>
        <div className="container">{children && children}</div>
    </div>
);

export default View;

