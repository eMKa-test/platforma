import React from "react";
import {
    Nav, NavItem, NavLink, TabContent, TabPane,
} from "reactstrap";
import classNames from "classnames";

import DesktopStats from "./Desktop";
import MobileStats from "./Mobile";

const Stats = () => {
    const [tab, setTab] = React.useState(0);
    const [includeStaff, toggleStaff] = React.useState(false);
    return (
        <div className="mb-3 content-tab-container">
            <div className="d-flex align-items-baseline justify-content-between">
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            title="Сайт"
                            className={classNames({ active: tab === 0 })}
                            onClick={() => setTab(0)}>
                            Сайт
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            title="Мобильные приложения"
                            className={classNames({ active: tab === 1 })}
                            onClick={() => setTab(1)}>
                            Мобильные приложения
                        </NavLink>
                    </NavItem>
                </Nav>
                <label className="d-flex justify-content-end">
                    Показать всех пользователей
                    &nbsp;
                    <input
                        type="checkbox"
                        checked={includeStaff}
                        onChange={() => toggleStaff(!includeStaff)} />
                </label>
            </div>
            <TabContent activeTab={tab}>
                <TabPane tabId={0}>
                    <DesktopStats includeStaff={includeStaff} />
                </TabPane>
                <TabPane tabId={1}>
                    <MobileStats includeStaff={includeStaff} />
                </TabPane>
            </TabContent>
        </div>
    );
};

export default React.memo(Stats);
