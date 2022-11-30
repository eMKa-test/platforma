import React from "react";
import * as PropTypes from "prop-types";
import Calendar from "Admin/components/Calendar";
import Filters from "./Filters";

const Header = (props) => {
    const {
        section, dates, handleChangeDate, dateFrom, currentCompany,
    } = props;
    return (
        <React.Fragment>
            <h1 className="h3 mb-3">{section.toUpperCase()}</h1>
            <div className="row d-flex justify-content-between align-items-start mb-3">
                <div className="col-md-12 col-lg-8">
                    {section.toUpperCase() === "PROMO" ? (
                        <Filters currentCompany={currentCompany} />
                    ) : null}
                </div>
                <div className="col-md-12 col-lg-4 d-flex justify-content-end">
                    <Calendar
                        dates={dates}
                        handleChangeDate={handleChangeDate}
                        selected={dateFrom} />
                </div>
            </div>
        </React.Fragment>
    );
};

Header.propTypes = {
    section: PropTypes.string.isRequired,
    dateFrom: PropTypes.string,
    dates: PropTypes.array,
    handleChangeDate: PropTypes.func,
    currentCompany: PropTypes.shape({}),
};

export default React.memo(Header);
