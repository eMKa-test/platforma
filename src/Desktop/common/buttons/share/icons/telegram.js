import React from "react";
import * as PropTypes from "prop-types";

const cb = () => null;

function Telegram(props) {
    const { onClick = cb } = props;
    return (
        <button
            type="button"
            aria-label="Поделиться в телеграм"
            className="share-button"
            onClick={onClick}>
            <span className="share-button__badge share-button__badge_telegram">
                <span className="share-button__icon share-button__icon_telegram" />
            </span>
        </button>
    );
}

Telegram.propTypes = {
    onClick: PropTypes.func,
};

export default React.memo(Telegram);
