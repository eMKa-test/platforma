import React from "react";
import * as PropTypes from "prop-types";

import { Calendar as ReactCalendar } from "react-calendar";
import "./style.css";

class Calendar extends React.Component {
    static propTypes = {
        dates: PropTypes.array.isRequired,
        selected: PropTypes.string,
        handleChangeDate: PropTypes.func,
    };

    render() {
        const { handleChangeDate, dates, selected } = this.props;
        return (
            <ReactCalendar
                onChange={handleChangeDate}
                minDetail="decade"
                locale="ru-RU"
                selectRange={false}
                value={selected ? new Date(selected) : null}
                tileDisabled={({ date, view }) => {
                    const day = moment(date).toString();
                    if (view === "month" && dates.includes(day)) {
                        return false;
                    } if (view !== "month") {
                        return false;
                    }
                    return true;
                }}
            />
        );
    }
}

export default Calendar;
