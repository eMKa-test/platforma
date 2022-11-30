import React from "react";

function Empty() {
    return <div>Заглушка въюхи</div>;
}

const Components = {
    Dashboard: React.lazy(() => import("Admin/views/Dashboard")),
    Companies: React.lazy(() => import("Admin/views/Companies")),
    CompaniesEdit: React.lazy(() => import("Admin/views/Companies/CompaniesEditContainer")),
    Objects: React.lazy(() => import("Admin/views/Objects/ObjectsContainer")),
    ObjectEdit: React.lazy(() => import("Admin/views/Objects/ObjectEditContainer")),
    LineEdit: React.lazy(() => import("Admin/views/Lines/LineEditContainer")),
    Promo: React.lazy(() => import("Admin/views/Promo")),
    Users: React.lazy(() => import("Admin/views/Users")),
    Activity: React.lazy(() => import("Admin/views/Activity")),
    Stats: React.lazy(() => import("Admin/views/Stats")),
    Config: React.lazy(() => import("Admin/views/Config")),
    Empty,
};

const DefaultContentSwitch = (props) => {
    const View = Components[props.componentName];
    return (
        <View {...props} />
    );
};

export default DefaultContentSwitch;
