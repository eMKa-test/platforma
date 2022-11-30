import React from "react";
import * as PropTypes from "prop-types";

const cb = () => null;

function Whatsup(props) {
    const { onClick = cb } = props;
    return (
        <button
            type="button"
            aria-label="Поделиться в WhatsUp"
            className="share-button"
            onClick={onClick}>
            <span className="share-button__badge share-button__badge_whatsup">
                <span className="share-button__icon share-button__icon_whatsup" />
            </span>
        </button>
    );
}

Whatsup.propTypes = {
    onClick: PropTypes.func,
};

export default React.memo(Whatsup);
