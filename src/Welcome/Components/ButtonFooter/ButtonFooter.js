import React from "react";
import * as PropTypes from "prop-types";

const ButtonFooter = (
    {
        name,
        link,
        classname,
        setOpenForm,
    },
) => (
    <button
        onClick={setOpenForm(link)}
        className={classname}
        type="button">
        {
            name
        }
    </button>
);

ButtonFooter.propTypes = {
    name: PropTypes.string.isRequired,
    classname: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    setOpenForm: PropTypes.func.isRequired,
};

export default ButtonFooter;
