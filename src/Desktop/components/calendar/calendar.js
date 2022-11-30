import React from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Calendar as ReactCalendar } from "react-calendar";

import Slide from "@material-ui/core/Slide";
import moment from "moment";
import styles from "./styles";
import metrikaEvents, { CALENDAR_CHANGE_DATE } from "../../../common/Metrika";

const Calendar = (
    {
        dates,
        date,
        changeDate,
        showCalendar,
        modeCalendar,
        classes,
        params: { companySlug, tab },
    },
) => {
    const onChangeDate = (newDate) => {
        changeDate(newDate);
        showCalendar(false);
        metrikaEvents.emit(CALENDAR_CHANGE_DATE, { companySlug, tab, date: moment(newDate).format("YYYY-MM-DD") });
    };

    return (
        <div className={classes.calendarWrapper}>
            <Slide
                in={modeCalendar}
                unmountOnExit
                mountOnEnter>
                <div
                    className="Calendar">
                    <ReactCalendar
                        onChange={onChangeDate}
                        minDetail="decade"
                        locale="ru-RU"
                        selectRange={false}
                        value={date ? new Date(date) : null}
                        tileDisabled={({ date, view }) => {
                            if (dates.length > 0) {
                                const day = moment(date).format("YYYY-MM-DD");
                                if (view === "month" && dates.includes(day)) {
                                    return false;
                                } if (view !== "month") {
                                    return false;
                                }
                            }
                            return true;
                        }} />
                </div>
            </Slide>
        </div>
    );
};

Calendar.propTypes = {
    changeDate: PropTypes.func.isRequired,
    showCalendar: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    modeCalendar: PropTypes.bool.isRequired,
    date: PropTypes.string.isRequired,
    dates: PropTypes.arrayOf(PropTypes.string),
    params: PropTypes.object.isRequired,
};

export default withStyles(styles)(Calendar);
