import React from "react";
import * as PropTypes from "prop-types";

const cb = () => null;

function Facebook(props) {
    const { onClick = cb } = props;
    return (
        <button
            type="button"
            aria-label="Поделиться в Facebook"
            className="share-button"
            onClick={onClick}>
            <span className="share-button__badge share-button__badge_facebook">
                <span className="share-button__icon share-button__icon_facebook" />
            </span>
        </button>
    );
}

Facebook.propTypes = {
    onClick: PropTypes.func,
};

export default React.memo(Facebook);
