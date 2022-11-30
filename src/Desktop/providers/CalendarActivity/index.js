import React, { Component } from "react";
import * as PropTypes from "prop-types";

const callback = () => {};

const CalendarActivityContext = React.createContext({
    modeCalendar: false,
    showCalendar: callback,
});

class ProvideCalendarActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modeCalendar: false,
        };
    }

    showCalendar = (val) => {
        this.setState({
            modeCalendar: val,
        });
    };

    render() {
        return (
            <CalendarActivityContext.Provider
                value={{
                    modeCalendar: this.state.modeCalendar,
                    showCalendar: this.showCalendar,
                }}>
                {this.props.children}
            </CalendarActivityContext.Provider>
        );
    }
}

ProvideCalendarActivity.propTypes = {
    children: PropTypes.element.isRequired,
};

export const CalendarActivityProvider = ProvideCalendarActivity;
export { CalendarActivityContext };
