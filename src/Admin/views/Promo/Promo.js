import React from "react";
import get from "lodash/get";
import * as PropTypes from "prop-types";
import { matchPath } from "react-router-dom";

const HeaderPromo = React.lazy(() => import("./Header"));
const PromoTabs = React.lazy(() => import("./PromoTabs"));

const path = "/admin/companies/:companyID/:section";

class Promo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCompany: null,
            section: "",
            activeTab: "video",
            dateFrom: "",
        };
    }

    componentDidMount() {
        this.setCompany(this.props);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.promo.content.length !== this.props.promo.content.length) {
            this.setCompany(this.props);
        }
    }

    componentWillUnmount() {
        this.props.clearPromo();
    }

    setCompany = () => {
        const { location: { pathname }, currentCompany } = this.props;
        const { section } = get(matchPath(pathname, { path }), "params", {});
        this.props.getPromoByCompaniesID(currentCompany.id, section);
        this.setState({ currentCompany, section }, () => {
            this.setCurrentDate(this.props.promo.dates[0]);
        });
    };

    setCurrentDate = (val) => {
        this.setState({
            dateFrom: moment(val).format("YYYY-MM-DD"),
        });
    };

    render() {
        const {
            currentCompany, dateFrom, section, activeTab,
        } = this.state;
        const { promo } = this.props;
        if (!currentCompany) {
            return null;
        }
        const dates = promo.dates.map((val) => moment(val).toString());
        return (
            <React.Suspense fallback={<span />}>
                <HeaderPromo
                    dates={dates}
                    dateFrom={dateFrom}
                    currentCompany={currentCompany}
                    handleChangeDate={this.setCurrentDate}
                    section={section} />
                {promo && (
                    <PromoTabs
                        section={section}
                        promo={promo}
                        dateFrom={dateFrom}
                        setCompany={this.setCompany}
                        currentCompany={currentCompany}
                        activeTab={activeTab} />
                )}
            </React.Suspense>
        );
    }
}

Promo.propTypes = {
    promo: PropTypes.shape({
        dates: PropTypes.array,
        content: PropTypes.array,
    }).isRequired,
    getPromoByCompaniesID: PropTypes.func.isRequired,
    clearPromo: PropTypes.func.isRequired,
    currentCompany: PropTypes.shape({
        id: PropTypes.number,
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
};

export default Promo;
