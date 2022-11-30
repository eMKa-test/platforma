import React from "react";
import { AppAside, AppFooter, AppHeader } from "@coreui/react";

import DefaultSidebar from "./DefaultSidebarContainer";
import DefaultContent from "./DefaultContentContainer";
import DefaultHeader from "./DefaultHeaderContainer";

const DefaultLayout = (props) => {
    return (
        <div className="app">
            <AppHeader fixed>
                <DefaultHeader {...props} />
            </AppHeader>
            <div className="app-body">
                <DefaultSidebar {...props} />
                <main className="main admin-bg_default">
                    <DefaultContent {...props} />
                </main>
                <AppAside fixed
                    hidden>
                    <div className="p-5">Мало ли пригодится</div>
                </AppAside>
            </div>
            <AppFooter>
                <span className="ml-auto">
                    Platforma.tech
                    {" "}
                    &copy;
                    {" "}
                    {new Date().getFullYear()}
                </span>
            </AppFooter>
        </div>
    );
};

export default DefaultLayout;
