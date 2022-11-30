import React from "react";
import classNames from "classnames";

import "./style.css";
import logo from "./assets/logo.png";
import playmarketIcon from "./assets/playmarket.png";
import appstoreIcon from "./assets/appstore.png";
import Close from "../Desktop/common/buttons/close";

const Mobile = ({show, onClose}) => (
    <div className={classNames(
        "mobile-stub-container", {
            "mobile-stub-container_show": show,
        })}>
        <Close onClick={onClose} />
        <div className="mobile-stub-container__main">
            <a
                className="mobile-stub-container__store-link mobile-stub-container__store-link_appstore"
                href="https://itunes.apple.com/ru/app/id1492450809">
                <img
                    className="mobile-stub-container__appstoreIcon"
                    src={appstoreIcon}
                    alt="appstoreIcon" />
            </a>
            <a
                className="mobile-stub-container__store-link mobile-stub-container__store-link_appstore"
                href="https://play.google.com/store/apps/details?id=com.doosinc.platforma">
                <img
                    className="mobile-stub-container__playmarketIcon"
                    src={playmarketIcon}
                    alt="playmarketIcon" />
            </a>
        </div>
        <div className="mobile-stub-container__footer">
            <img
                className="mobile-stub-container__footer-logo-pic"
                src={logo}
                alt="logo" />
        </div>
    </div>
);

export default Mobile;
