import React from "react";
import * as PropTypes from "prop-types";
import Calendar from "../../components/Calendar";

class BodyTabAside extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        const {
            dates, dateFrom, handleChangeDate, asidePanel, toggleAsidePanel,
        } = this.props;
        return (
            <React.Fragment>
                <div className={`tab-aside-panel ${asidePanel ? "aside_show" : "aside_hide"}`}>
                    <button
                        type="button"
                        className={`aside-button-toggle btn_like_div ${asidePanel ? "toggler_top" : "toggler_left"}`}
                        onClick={toggleAsidePanel()}>
                        {
                            asidePanel
                                ? <i className="icon-close icons d-block" />
                                : <i className="icon-calendar icons d-block" />
                        }
                    </button>
                    <div className="Calendar">
                        <Calendar
                            dates={dates}
                            handleChangeDate={handleChangeDate}
                            selected={dateFrom} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

BodyTabAside.propTypes = {
    dates: PropTypes.array,
    dateFrom: PropTypes.string,
    handleChangeDate: PropTypes.func.isRequired,
    asidePanel: PropTypes.bool.isRequired,
    toggleAsidePanel: PropTypes.func.isRequired,
};

export default BodyTabAside;
