import React from "react";
import * as PropTypes from "prop-types";

import {
    CALENDAR_CHANGE_DATE,
    DOWNLOAD,
    MAP_CHANGE_LOCATION,
    MAP_OPEN,
    START,
    VIDEO_CHANGE,
    VIDEO_EXIT,
    VIDEO_RESUME,
    VIDEO_START,
    VIEWED,
    FULLSCREEN_SCORE,
    PANORAMA_ENTER, PANORAMA_VIEW_CONTENT,
    AEROPANORAMA_SUBLINE_ENTER, AEROPANORAMA_SUBLINE_PAN_STEPS,
    LOGO_CLICK, LINE_SELECTION, COMPANY_CHANGE, LOG_OUT,
    PROMO_MONTH_SELECT, SHARE_VIEW, SHARE_CLICK,
    SLIDE_SHOW_VIEW,
} from "../../../../../common/Metrika";
import Pagination from "../../../../layout/DefaultPagination";
import ContentProvider from "../../../../../ContentProvider";

const VideoExit = React.lazy(() => import("./Tables/VideoExit"));
const VideoChange = React.lazy(() => import("./Tables/VideoChange"));
const Start = React.lazy(() => import("./Tables/Start"));
const Download = React.lazy(() => import("./Tables/Download"));
const Viewed = React.lazy(() => import("./Tables/Viewed"));
const VideoStart = React.lazy(() => import("./Tables/VideoStart"));
const VideoResume = React.lazy(() => import("./Tables/VideoResume"));
const MapOpen = React.lazy(() => import("./Tables/MapOpen"));
const MapChangeLocation = React.lazy(() => import("./Tables/MapChangeLocation"));
const CalendarChangeLocation = React.lazy(() => import("./Tables/CalendarChangeLocation"));
const FullscreenScore = React.lazy(() => import("./Tables/FullscreenScore"));
const PanoramaEnter = React.lazy(() => import("./Tables/PanoramaEnter"));
const PanoramaViewContent = React.lazy(() => import("./Tables/PanoramaViewContent"));
const AeropanoramaSublineEnter = React.lazy(() => import("./Tables/AeropanoramaSublineEnter"));
const AeropanoramaSublinePanSteps = React.lazy(() => import("./Tables/AeropanoramaSublinePanSteps"));
const LogoClick = React.lazy(() => import("./Tables/LogoClick"));
const LineSelection = React.lazy(() => import("./Tables/LineSelection"));
const CompanyChange = React.lazy(() => import("./Tables/CompanyChange"));
const LogOut = React.lazy(() => import("./Tables/LogOut"));
const PromoFilterSelectMonth = React.lazy(() => import("./Tables/PromoFilterSelectMonth"));
const ShareClick = React.lazy(() => import("./Tables/ShareClick"));
const ShareView = React.lazy(() => import("./Tables/ShareView"));
const SlideShowView = React.lazy(() => import("./Tables/SlideShowView"));

function switchView(event, payload) {
    switch (event) {
        case START: {
            return <Start payload={payload} />;
        }
        case DOWNLOAD: {
            return <Download payload={payload} />;
        }
        case VIEWED: {
            return <Viewed payload={payload} />;
        }
        case VIDEO_START: {
            return <VideoStart payload={payload} />;
        }
        case VIDEO_RESUME: {
            return <VideoResume payload={payload} />;
        }
        case VIDEO_EXIT: {
            return <VideoExit payload={payload} />;
        }
        case VIDEO_CHANGE: {
            return <VideoChange payload={payload} />;
        }
        case MAP_OPEN: {
            return <MapOpen payload={payload} />;
        }
        case MAP_CHANGE_LOCATION: {
            return <MapChangeLocation payload={payload} />;
        }
        case CALENDAR_CHANGE_DATE: {
            return <CalendarChangeLocation payload={payload} />;
        }
        case FULLSCREEN_SCORE: {
            return <FullscreenScore payload={payload} />;
        }
        case PANORAMA_ENTER: {
            return <PanoramaEnter payload={payload} />;
        }
        case PANORAMA_VIEW_CONTENT: {
            return <PanoramaViewContent payload={payload} />;
        }
        case AEROPANORAMA_SUBLINE_ENTER: {
            return <AeropanoramaSublineEnter payload={payload} />;
        }
        case AEROPANORAMA_SUBLINE_PAN_STEPS: {
            return <AeropanoramaSublinePanSteps payload={payload} />;
        }
        case LOGO_CLICK: {
            return <LogoClick payload={payload} />;
        }
        case LINE_SELECTION: {
            return <LineSelection payload={payload} />;
        }
        case COMPANY_CHANGE: {
            return <CompanyChange payload={payload} />;
        }
        case LOG_OUT: {
            return <LogOut payload={payload} />;
        }
        case PROMO_MONTH_SELECT: {
            return <PromoFilterSelectMonth payload={payload} />;
        }
        case SHARE_VIEW: {
            return <ShareView payload={payload} />;
        }
        case SHARE_CLICK: {
            return <ShareClick payload={payload} />;
        }
        case SLIDE_SHOW_VIEW: {
            return <SlideShowView payload={payload} />;
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
            startParams={{ event, userId: user.id, source: "SITE" }}
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
