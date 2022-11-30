import React from "react";
import {
    DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem,
} from "reactstrap";
import * as PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import {
    AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler,
} from "@coreui/react";

import logo from "assets/logo.svg";

function redirect(location) {
    // eslint-disable-next-line
    return () => (window.location.href = location);
}

function makeUrl(companies) {
    const companyStorage = Number(localStorage.currentCompany);
    let slug;
    if (companyStorage) {
        // eslint-disable-next-line no-restricted-syntax
        for (const val of companies) {
            if (companyStorage === val.id) {
                slug = val.slug;
            }
        }
    } else {
        slug = companies[0].slug;
    }
    const url = `/${slug}/objects`;
    return url;
}

function DefaultHeader({ operator, routes, companies }) {
    return (
        <>
            <AppSidebarToggler
                className="d-lg-none"
                display="md"
                mobile />
            <AppNavbarBrand
                full={{
                    src: logo,
                    width: 130,
                    height: 35,
                    alt: "Platforma.tech",
                }}
                minimized={{
                    src: logo,
                    width: 130,
                    height: 35,
                    alt: "Platforma.tech",
                }} />
            {/* <AppSidebarToggler */}
            {/*    className="d-md-down-none" */}
            {/*    display="lg" /> */}
            <Nav
                className="d-md-down-none mr-auto"
                navbar>
                <AppHeaderDropdown direction="down">
                    <DropdownToggle className="navbar-toggler-icon" />
                    <DropdownMenu
                        right
                        style={{ right: "auto" }}>
                        <DropdownItem onClick={redirect("/logout")}>
                            <i className="fa fa-lock" />
                            <span>Выйти</span>
                        </DropdownItem>
                        <DropdownItem onClick={redirect(makeUrl(companies))}>
                            <i className="fa fa-home" />
                            <span>Вернуться на сайт</span>
                        </DropdownItem>
                    </DropdownMenu>
                </AppHeaderDropdown>
                {routes.map((route) => route.name && (
                    <NavItem
                        className="px-3"
                        key={route.component}>
                        <NavLink
                            className="nav-link"
                            activeClassName="active"
                            to={route.to}>
                            {route.name}
                        </NavLink>
                    </NavItem>
                ))}
            </Nav>
            <div className="mr-5">
                <span>{operator.email}</span>
            </div>
            {/* <AppAsideToggler className="d-md-down-none" /> */}
            {/* <AppAsideToggler className="d-lg-none" mobile /> */}
        </>
    );
}

DefaultHeader.propTypes = {
    operator: PropTypes.shape({
        email: PropTypes.string.isRequired,
    }).isRequired,
    routes: PropTypes.arrayOf(
        PropTypes.shape({
            path: PropTypes.string.isRequired,
            name: PropTypes.string,
        }),
    ).isRequired,
};

export default DefaultHeader;
