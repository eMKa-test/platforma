import React from "react";
import * as PropTypes from "prop-types";
import {
    Nav, NavItem, NavLink, TabContent, TabPane,
} from "reactstrap";
import classnames from "classnames";
import PromoVideoTab from "./PromoVideoTab";

const PromoTabs = ({
    activeTab, currentCompany, setCompany, section, dateFrom, promo,
}) => (
    <div className="mb-3">
        <Nav tabs>
            <NavItem>
                <NavLink className={classnames({ active: activeTab === "video" })}>
                    Видео
                </NavLink>
            </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
            <TabPane tabId="video">
                {activeTab === "video" && (
                    <PromoVideoTab
                        currentCompany={currentCompany}
                        setCompany={setCompany}
                        section={section}
                        promo={promo}
                        dateFrom={dateFrom} />
                )}
            </TabPane>
        </TabContent>
    </div>
);

PromoTabs.propTypes = {
    activeTab: PropTypes.string.isRequired,
    currentCompany: PropTypes.shape({}).isRequired,
    setCompany: PropTypes.func.isRequired,
    section: PropTypes.string,
    dateFrom: PropTypes.string,
    promo: PropTypes.shape({}),
};

export default React.memo(PromoTabs);
