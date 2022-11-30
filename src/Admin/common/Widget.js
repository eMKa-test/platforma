import React from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import { mapToCssModules } from "reactstrap/lib/utils";

function Widget(props) {
    const {
        title, description, className, cssModule, image, point, company,
    } = props;

    const bg = { backgroundImage: image ? `url('${image}')` : "none" };

    const classCard = "brand-card";
    const classCardHeader = classNames(company ? `${classCard}-header-company` : `${classCard}-header`, point && `${classCard}-header_blank`);
    const classCardTitle = `${classCard}-title h5`;
    const classCardTitleCompany = `${classCard}-title-company h5`;
    const classCardBody = classNames(`${classCard}-body`, "px-2");
    const classes = mapToCssModules(classNames(classCard, className), cssModule);

    return (
        <div className={classes}>
            <div
                className={classCardHeader}
                style={bg}>
                <span className={company ? classCardTitleCompany : classCardTitle}>{title}</span>
            </div>
            {description ? (
                <div className={classCardBody}>
                    <div className="text-muted text-nowrap text-truncate">{description}</div>
                </div>
            ) : null}
        </div>
    );
}

Widget.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    className: PropTypes.string,
    cssModule: PropTypes.object,
    point: PropTypes.bool,
    company: PropTypes.bool,
    image: PropTypes.string,
};

export default React.memo(Widget);
