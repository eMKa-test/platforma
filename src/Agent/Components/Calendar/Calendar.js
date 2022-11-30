import React from "react";
import * as PropTypes from "prop-types";
import { Calendar as ReactCalendar } from "react-calendar";

const Calendar = ({ handleChangeDate, date }) => (
    <ReactCalendar
        onChange={handleChangeDate}
        minDetail="decade"
        locale="ru-RU"
        selectRange={false}
        value={date} />
);

Calendar.propTypes = {
    handleChangeDate: PropTypes.func,
};

export default Calendar;
