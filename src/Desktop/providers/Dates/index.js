import React from "react";
import PropTypes from "prop-types";
import memoize from "lodash/memoize";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { withRouter, matchPath } from "react-router";

import { ALL_MENU_ITEMS_ROUTES_V2 } from "../../router/routePaths";

const initDate = moment().subtract(1, "day").format("YYYY-MM-DD");

const DateContext = React.createContext({
    date: initDate,
    dates: [],
    sublineMode: false,
});

const getParams = memoize((pathname) => {
    return get(matchPath(pathname, {
        path: ALL_MENU_ITEMS_ROUTES_V2,
    }), "params", {});
});

class ProvideDate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: initDate,
            dates: [],
            sublineMode: false,
        };
    }

    componentDidMount() {
        this.handleChanges();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.pathname === this.props.location.pathname) {
            return;
        }
        this.handleChanges();
    }

    handleChanges = () => {
        const pathname = get(this.props, "location.pathname");
        const { typeView, date } = getParams(pathname);
        if (typeView !== "content") {
            return;
        }
        const newState = {};
        if (date && date !== this.state.date) {
            newState.date = date;
        }
        if (!isEmpty(newState)) {
            this.setState(newState, () => {

            });
        }
    };

    changeDate = (date) => {
        this.setState({
            date: moment(date).format("YYYY-MM-DD"),
        });
    };

    putDates = (dates) => {
        this.setState({ dates });
    };

    setSublineMode = (sublineMode) => {
        this.setState({ sublineMode });
    };

    render() {
        return (
            <DateContext.Provider
                value={{
                    date: this.state.date,
                    dates: this.state.dates,
                    sublineMode: this.state.sublineMode,
                    changeDate: this.changeDate,
                    putDates: this.putDates,
                    setSublineMode: this.setSublineMode,
                }}>
                {this.props.children}
            </DateContext.Provider>
        );
    }
}

ProvideDate.propTypes = {
    children: PropTypes.element.isRequired,
    location: PropTypes.object.isRequired,
};

export const DatesProvider = withRouter(ProvideDate);
export const DatesConsumer = DateContext.Consumer;
