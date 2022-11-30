import React from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import "./style.css";

const EditInfo = (
    {
        title,
        parOne,
        parTwo,
        parThree,
        children,
    },
) => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="edit-info-wrapper">
            <button
                onClick={() => setOpen(!open)}
                type="button"
                className="btn_like_div edit-info-btn">
                <i className="fa fa-info d-block" />
            </button>
            <div className={
                classNames(
                    "edit-info-body",
                    {
                        "info-body_open": open,
                        "info-body_close": !open,
                    },
                )
            }>
                {
                    title && (
                        <p className="edit-info-body__title">
                            {
                                title
                            }
                        </p>
                    )
                }
                {
                    parOne && (
                        <p className="edit-info-body__paragraph edit-info-body__paragraph-one">
                            {
                                parOne
                            }
                        </p>
                    )
                }
                {
                    parTwo && (
                        <p className="edit-info-body__paragraph edit-info-body__paragraph-two">
                            {
                                parTwo
                            }
                        </p>
                    )
                }
                {
                    parThree && (
                        <p className=" edit-info-body__paragraph edit-info-body__paragraph-three">
                            {
                                parThree
                            }
                        </p>
                    )
                }
                {
                    children
                }
                <button
                    onClick={() => setOpen(!open)}
                    type="button"
                    className="btn_like_div edit-info-close-info">
                    <i className="fa fa-times d-block" />
                </button>
            </div>
        </div>
    );
};

EditInfo.propTypes = {
    title: PropTypes.string,
    parOne: PropTypes.string,
    parTwo: PropTypes.string,
    parThree: PropTypes.string,
    children: PropTypes.element,
};

export default EditInfo;
