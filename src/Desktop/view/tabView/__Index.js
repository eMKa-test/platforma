import React from "react";
import * as PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import TabView from "./tabView";
import axios from "../../common/axios";
import Spinner from "../../components/spinner";
import NoContent from "../../components/noContent/noContent";
import { getContentController } from "../../router/routeControl";
import { ALL_MENU_ITEMS_ROUTES_V2 } from "../../router/routePaths";

const NO_CONTENTID = ["image", "video", "cameras"];

function checkContentID(id, arr) {
    return arr.findIndex((el) => el.id === Number(id));
}

class TabViewContainer extends React.Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        date: PropTypes.string.isRequired,
        putDates: PropTypes.func.isRequired,
        changeDate: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: null,
            url: "",
        };
    }

    cancel = [];

    componentDidMount() {
        const { pathname } = this.props.location;
        const { params: route } = getContentController(pathname, ALL_MENU_ITEMS_ROUTES_V2);
        if (route.date && route.contentID) {
            this.launchData(route, false);
        } else if (route.date) {
            this.launchData(route, false, route.date);
        } else {
            this.launchData(route, true);
        }
    }

    componentDidUpdate(prevProps) {
        const { location: { pathname: path }, date } = this.props;
        const { pathname: prevPath } = prevProps.location;
        const { params: prevRoute } = getContentController(prevPath, ALL_MENU_ITEMS_ROUTES_V2);
        const { params: route } = getContentController(path, ALL_MENU_ITEMS_ROUTES_V2);
        if (prevRoute.lineID !== route.lineID) {
            this.launchData(route, true);
        }
        if (prevRoute.tab !== route.tab && prevRoute.lineID === route.lineID) {
            this.launchData(route);
        }
        if (prevProps.date !== date && prevRoute.lineID === route.lineID && prevRoute.tab === route.tab && route.tab !== "aeropanorama") {
            this.launchData(route);
        }
    }

    componentWillUnmount() {
        this.props.changeDate(moment().subtract(1, "day").format("YYYY-MM-DD"));
        this.cancel.forEach((cancel) => {
            if (typeof cancel === "function") {
                cancel();
            }
        });
    }

    launchData = (route, flag = false, urlDate) => {
        this.setState({
            data: null,
            loading: true,
        }, async () => {
            const {
                putDates,
                changeDate,
                date,
            } = this.props;
            const {
                companySlug,
                lineID,
                tab,
                contentID,
            } = route;
            if (tab !== "cameras" && tab !== "nomatch") {
                let datas = await this.fetchData(date, tab, flag, urlDate, route);
                if (datas) {
                    putDates(datas.dates);
                    const rightDate = datas.date;
                    changeDate(rightDate);
                    if (datas.content.length > 0) {
                        if (tab === "panorama") {
                            const panoramContent = await this.getPanoramData(
                                datas.content, { tab, lineID }, rightDate,
                            );
                            datas = {
                                ...datas,
                                ...panoramContent,
                            };
                        }
                        this.setState({
                            data: datas.content,
                            loading: false,
                        });
                    } else {
                        this.setState({
                            data: null,
                            loading: false,
                        });
                    }
                    let url = `/${companySlug}/content/${lineID}/${tab}/${rightDate}`;
                    if (!NO_CONTENTID.includes(tab) && (datas.content.length > 0 || datas.content.panoramas)) {
                        let id = contentID;
                        if (id) {
                            if (tab === "aerial" || tab === "timelapse") {
                                if (checkContentID(id, datas.content) === -1) {
                                    [{ id }] = datas.content;
                                } else {
                                    id = contentID;
                                }
                            } else if (tab === "aeropanorama") {
                                if (checkContentID(id, datas.content) === -1) {
                                    [{ id }] = datas.content;
                                } else {
                                    id = contentID;
                                }
                            }
                        } else if (tab === "panorama" && !contentID) {
                            id = datas.content.panoramas[0].id;
                        } else {
                            id = datas.content[0].id;
                        }
                        url = `/${companySlug}/content/${lineID}/${tab}/${rightDate}/${id}`;
                    }
                    this.setFreshURL(url);
                } else {
                    putDates([]);
                    this.setState({
                        data: null,
                        loading: false,
                    });
                }
            } else {
                putDates([]);
                this.setState({
                    data: null,
                    loading: false,
                });
            }
        });
    };

    async fetchData(date, tab, flag, urlDate, route) {
        try {
            const { lineID } = route;
            if (flag) {
                const dates = await this.getDates({ lineID, tab });
                if (dates.payload && dates.payload.length > 0) {
                    const newDate = dates.payload[0];
                    const content = await this.getContent({ lineID, tab }, newDate);
                    return {
                        dates: dates.payload,
                        content: content.payload,
                        date: newDate,
                    };
                }
                return null;
            }
            const newDate = urlDate || date;
            const [dates, content] = await Promise.all([
                this.getDates({ lineID, tab }),
                this.getContent({ lineID, tab }, newDate),
            ]);
            return {
                dates: dates.payload,
                content: content.payload,
                date: newDate,
            };
        } catch (e) {
            return null;
        }
    }

    getDates = ({ tab, lineID }) => {
        let curTab = tab;
        if (tab === "aeropanorama") {
            curTab = "panorama";
        }
        const url = `/user/api/lines/${lineID}/content/${curTab}/calendar/`;
        const [cancel, promise] = axios("get", url, null, true);
        this.cancel.push(cancel);
        return promise;
    };

    getContent = ({ tab, lineID }, date, type) => {
        let params = { dateFrom: date };
        const url = `/user/api/lines/${lineID}/content/${type || tab}`;
        if (tab === "aeropanorama") {
            params = {};
        }
        const [cancel, promise] = axios("get", url, params, true);
        this.cancel.push(cancel);
        return promise;
    };

    async getPanoramData(data, routeParams, date) {
        let datas = {
            panoramas: data,
        };
        const [images, videos] = await Promise.all([
            this.getContent(routeParams, date, "image"),
            this.getContent(routeParams, date, "video"),
        ]);
        datas = {
            content: {
                ...datas,
                media: [
                    ...images.payload,
                    ...videos.payload,
                ],
            },
        };
        return datas;
    }

    setFreshURL = (url) => {
        if (this.state.url === url) {
            return null;
        }
        this.setState({ url }, () => {
            this.props.history.replace(url);
        });
        return null;
    };

    setNoContent = () => {
        this.setState({ data: null });
    };

    render() {
        const { pathname } = this.props.location;
        const { params: route } = getContentController(pathname, ALL_MENU_ITEMS_ROUTES_V2);
        const { data, loading } = this.state;
        if (loading) {
            return <Spinner />;
        }
        return (
            <React.Fragment>
                {
                    !data && route.tab !== "cameras" && route.tab !== "nomatch" ? (
                        <NoContent />
                    ) : (
                        <TabView
                            setNoContent={this.setNoContent}
                            setContentId={this.setFreshURL}
                            route={route}
                            media={data}
                            {...this.props} />
                    )
                }
            </React.Fragment>
        );
    }
}

export default withRouter(TabViewContainer);
