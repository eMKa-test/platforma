import React from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";

import metrikaEvents, { SHARE_CLICK } from "../../../../common/Metrika";

import "./style.css";
import Telegram from "./icons/telegram";
import Whatsup from "./icons/whatsup";
import Facebook from "./icons/facebook";
import Twitter from "./icons/twitter";

function handleShare(socialType, meta) {
    const url = `${window.location.host}/share/${meta.mediaType.toLowerCase()}?source=${meta.source}`;
    return (ev) => {
        ev.stopPropagation();
        switch (socialType) {
            case "telegram": {
                window.open(`https://telegram.me/share/url?url=${url}`, "_blank");
                break;
            }
            case "whatsup": {
                window.open(`https://api.whatsapp.com/send?text=${url}`, "_blank");
                break;
            }
            case "twitter": {
                window.open(`https://twitter.com/intent/tweet?url=${url}`, "_blank");
                break;
            }
            case "facebook": {
                window.open(`https://www.facebook.com/sharer.php?src=sp&u=${url}`, "_blank");
                break;
            }
            default: {
                // ...
            }
        }
        metrikaEvents.emit(SHARE_CLICK, { ...meta, socialType });
    };
}

function ShareButton(props) {
    const {
        source, mediaType, className = "", top,
    } = props;

    const meta = { source, mediaType };

    return (
        <div className="share-container">
            <div
                className={classNames(
                    "share-container-toggle",
                    className,
                )}>
                <span className="icon-fontello-2-share" />
            </div>
            <div
                className={classNames("share-links", {
                    "share-links_top": top,
                })}>
                <Telegram onClick={handleShare("telegram", meta)} />
                <Whatsup onClick={handleShare("whatsup", meta)} />
                <Twitter onClick={handleShare("twitter", meta)} />
                <Facebook onClick={handleShare("facebook", meta)} />
            </div>
        </div>
    );
}

ShareButton.propTypes = {
    source: PropTypes.string.isRequired,
    mediaType: PropTypes.string.isRequired,
    className: PropTypes.string,
    top: PropTypes.bool,
};

export default React.memo(ShareButton);
