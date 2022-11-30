import React from "react";
import * as PropTypes from "prop-types";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { withRouter, matchPath } from "react-router-dom";
import memoize from "lodash/memoize";
import axios from "../../common/axios";
import { ALL_MENU_ITEMS_ROUTES_V2 } from "../../router/routePaths";

const RightsContext = React.createContext({
    user: {},
    companies: [],
    currentCompany: {},
    // TODO: убрать
    mainLoader: false,
    sideLoader: false,
});

const getParams = memoize((pathname) => {
    return get(matchPath(pathname, {
        path: ALL_MENU_ITEMS_ROUTES_V2,
    }), "params", {});
});

function checkStorageCompany() {
    if (!localStorage.getItem("currentCompany")) {
        return false;
    }
    return Number(localStorage.getItem("currentCompany"));
}

const callback = () => {};

class Rights extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            companies: [],
            currentCompany: {},
        };
    }

    componentDidMount() {
        const { user } = this.props;
        if (!isEmpty(user)) {
            this.setState({ user });
        }
        this.fetchData();
    }

    checkCompany = (companies) => {
        const { pathname } = this.props.location;
        const { companySlug, date, typeView, tab } = getParams(pathname);
        const storageCompany = checkStorageCompany();
        const result = {
            success: false,
        };
        // eslint-disable-next-line no-restricted-syntax
        for (const val of companies) {
            if ((companySlug && val.slug === companySlug) || storageCompany === val.id) {
                return {
                    ...result,
                    company: val,
                    success: true,
                    date,
                    typeView,
                    tab,
                };
            }
        }
        return result;
    };

    fetchData = () => {
        this.setState({
            mainLoader: true,
            sideLoader: true,
        }, async () => {
            const newState = {};
            try {
                const { success = false, payload: companies } = await axios("get", "/user/api/companies");
                if (success) {
                    let currentCompany;
                    if (Array.isArray(companies) && companies.length > 0) {
                        newState.companies = companies;
                    }
                    if (!checkStorageCompany()) {
                        // eslint-disable-next-line prefer-destructuring
                        [currentCompany] = companies;
                    } else {
                        const accessCompany = this.checkCompany(companies);
                        if (accessCompany.success) {
                            currentCompany = accessCompany.company;
                        } else {
                            [currentCompany] = companies;
                        }
                        if (!accessCompany.date && (accessCompany.typeView !== "promo" && accessCompany.tab !== "model")) {
                            this.replaceUrl(currentCompany.slug);
                        }
                    }
                    setTimeout(() => localStorage.setItem("currentCompany", currentCompany.id));
                    newState.currentCompany = currentCompany;
                }
                this.setState({
                    ...newState,
                    mainLoader: false,
                    sideLoader: false,
                });
            } catch (e) {
                window.location.href = "/logout";
            }
        });
    };

    replaceUrl = (slug = "") => {
        const url = slug ? `/${slug}/objects` : "/objects";
        const { replace } = this.props.history;
        if (typeof replace === "function") {
            replace(url);
        }
    };

    // FIXME: надо избавится от cb && cbHeader, это что-то непонятное и надо это убрать
    changeCompany = (value, cb = callback, cbHeader = callback) => () => {
        const currentID = get(this.state, "currentCompany.id");
        if (value === currentID) {
            return cb();
        }
        if (cb) {
            cb();
        }
        cbHeader(false);
        const { companies } = this.state;
        const index = companies.findIndex((comp) => comp.id === value);
        localStorage.setItem("currentCompany", companies[index].id);
        this.setState((state) => ({ currentCompany: state.companies[index] }), () => {
            this.replaceUrl(companies[index].slug);
        });
    };

    render() {
        if (isEmpty(this.state.currentCompany)) {
            return null;
        }
        const value = {
            ...this.state,
            changeCompany: this.changeCompany,
        };
        return (
            <RightsContext.Provider value={value}>
                {this.props.children}
            </RightsContext.Provider>
        );
    }
}

Rights.propTypes = {
    children: PropTypes.element.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        status: PropTypes.oneOf(["ACTIVE"]).isRequired,
    }).isRequired,
};

export const RightsConsumer = RightsContext.Consumer;
export const RightsProvider = withRouter(Rights);
export { RightsContext };
