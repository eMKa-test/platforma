import React from "react";
import * as PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import Alert from "reactstrap/es/Alert";
import Button from "reactstrap/es/Button";
import ButtonGroup from "reactstrap/es/ButtonGroup";

import events from "./events";

const AllStats = React.lazy(() => import("./All"));
const UserStats = React.lazy(() => import("./User"));

const eventsEntries = Object.entries(events);

function Metrika({ includeStaff = false }) {
    const [user, setUser] = React.useState(null);
    const [event, setEvent] = React.useState("START");
    return (
        <React.Fragment>
            <ButtonGroup className="mb-3 w-100 admin-modal__buttons">
                {eventsEntries.map(([key, item]) => (
                    <Button
                        className="rounded-0 m-1"
                        key={key}
                        title={item.description}
                        onClick={() => setEvent(key)}
                        active={event === key}>
                        {item.title}
                    </Button>
                ))}
            </ButtonGroup>
            <React.Suspense fallback={<span />}>
                {!isEmpty(user) ? (
                    <React.Fragment>
                        <Alert color="secondary">
                            <div className="d-flex align-items-center">
                                <Button
                                    onClick={() => setUser(null)}
                                    size="sm">
                                    <span className="icon-arrow-left" />
                                </Button>
                                <div className="ml-2">
                                    {`${user.name} ${user.email && `(${user.email})`}`}
                                </div>
                            </div>
                        </Alert>
                        <UserStats
                            event={event}
                            user={user} />
                    </React.Fragment>
                ) : (
                    <AllStats
                        includeStaff={includeStaff}
                        event={event}
                        setUser={setUser} />
                )}
            </React.Suspense>
        </React.Fragment>
    );
}

Metrika.propTypes = {
    includeStaff: PropTypes.bool,
};

export default Metrika;
