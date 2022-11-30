import React from "react";
import * as PropTypes from "prop-types";

const cb = () => null;

function Twitter(props) {
    const { onClick = cb } = props;
    return (
        <button
            type="button"
            aria-label="Поделиться в Twitter"
            className="share-button"
            onClick={onClick}>
            <span className="share-button__badge share-button__badge_twitter">
                <span className="share-button__icon share-button__icon_twitter" />
            </span>
        </button>
    );
}

Twitter.propTypes = {
    onClick: PropTypes.func,
};

export default React.memo(Twitter);
