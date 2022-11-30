import React from "react";

import userSvg from "./user.svg";

const LoginButton = ({ onClick }) => (
    <div className="LoginButton"
        onClick={onClick}>
        <img src={userSvg}
            alt="" />
    </div>
);

export default LoginButton;
