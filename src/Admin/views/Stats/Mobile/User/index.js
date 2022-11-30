import React from "react";
import * as PropTypes from "prop-types";

import Pagination from "../../../../layout/DefaultPagination";
import ContentProvider from "../../../../../ContentProvider";
import {
    START, LOG_OUT, VIEWED, CALENDAR_CHANGE_DATE, LINE_SELECTION, COMPANY_CHANGE, SHARE_BY_URL, SHARE_BY_FILE,
} from "../events";

const Start = React.lazy(() => import("./Tables/Start"));
const LogOut = React.lazy(() => import("./Tables/LogOut"));
const Viewed = React.lazy(() => import("./Tables/Viewed"));
const CalendarChangeDate = React.lazy(() => import("./Tables/CalendarChangeDate"));
const LineSelection = React.lazy(() => import("./Tables/LineSelection"));
const CompanyChange = React.lazy(() => import("./Tables/CompanyChange"));
const ShareByUrl = React.lazy(() => import("./Tables/ShareByUrl"));
const ShareByFile = React.lazy(() => import("./Tables/ShareByFile"));

function switchView(event, payload) {
    switch (event) {
        case START: {
            return <Start payload={payload} />;
        }
        case LOG_OUT: {
            return <LogOut payload={payload} />;
        }
        case VIEWED: {
            return <Viewed payload={payload} />;
        }
        case CALENDAR_CHANGE_DATE: {
            return <CalendarChangeDate payload={payload} />;
        }
        case LINE_SELECTION: {
            return <LineSelection payload={payload} />;
        }
        case COMPANY_CHANGE: {
            return <CompanyChange payload={payload} />;
        }
        case SHARE_BY_URL: {
            return <ShareByUrl payload={payload} />;
        }
        case SHARE_BY_FILE: {
            return <ShareByFile payload={payload} />;
        }
        default: {
            return null;
        }
    }
}

function UserStats(props) {
    const { user, event } = props;
    return (
        <ContentProvider
            startParams={{ event, userId: user.id, source: "APPONLY" }}
            url="/admin/api/siteEvents">
            {(context) => {
                const {
                    payload, total, limit, page, onChangePage, onChangeRowsPerPage,
                } = context;
                return (
                    <React.Fragment>
                        <Pagination
                            total={total}
                            onPagination={(p, l) => {
                                if (l !== limit) {
                                    onChangeRowsPerPage(l);
                                }
                                if (p !== page) {
                                    onChangePage(p);
                                }
                            }}
                            pagination={{
                                page,
                                limit,
                            }} />
                        <React.Suspense fallback={<span />}>
                            {switchView(event, payload)}
                        </React.Suspense>
                    </React.Fragment>
                );
            }}
        </ContentProvider>
    );
}

UserStats.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }).isRequired,
    event: PropTypes.string.isRequired,
};

export default UserStats;
