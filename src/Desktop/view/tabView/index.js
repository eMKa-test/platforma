import React from "react";
import * as PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import TabView from "./tabView";
import axios from "../../common/axios";
import Spinner from "../../components/spinner";
import NoContent from "../../components/noContent/noContent";
import { getContentController } from "../../router/routeControl";
import { ALL_MENU_ITEMS_ROUTES_V2 } from "../../router/routePaths";
import { TABS_WITHOUT_CONTENTID } from "../../../constants";

class TabViewContainer extends React.Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        date: PropTypes.string,
        dates: PropTypes.array.isRequired,
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
        this.mountData(route);
    }

    componentDidUpdate(prevProps, prevState) {
        const { location: { pathname: path }, date } = this.props;
        const { pathname: prevPath } = prevProps.location;
        const { params: prevRoute } = getContentController(prevPath, ALL_MENU_ITEMS_ROUTES_V2);
        const { params: route } = getContentController(path, ALL_MENU_ITEMS_ROUTES_V2);
        if (route.tab !== "nomatch" && route.tab !== "model") {
            if (prevRoute.lineID !== route.lineID) {
                this.changeLineContent(route);
            }
            if (date && prevProps.date !== date && this.state.url === prevState.url) {
                this.changeDateContent({ route, date });
            }
            if (prevRoute.tab !== route.tab && prevRoute.tab !== "nomatch") {
                this.changeTabContent(route);
            }
        }
        if (prevRoute.tab !== route.tab && route.tab === "model") {
            const url = `/${route.companySlug}/content/${route.lineID}/model`;
            this.contentFalse(url);
        }
        if (prevRoute.tab !== route.tab && route.tab === "nomatch") {
            this.checkNoMatchPath(path);
        }
    }

    componentWillUnmount() {
        this.props.changeDate(moment().subtract(1, "day").format("YYYY-MM-DD"));
        this.cancelRequests();
    }

    mountData = async (route) => {
        const {
            companySlug, lineID, tab, contentID,
        } = route;
        const url = `/${companySlug}/content/${lineID}/${tab}`;
        if (tab !== "cameras" && tab !== "nomatch" && tab !== "model") {
            this.getData(route)
                .then(this.getContent)
                .then(({ date: correctDate = "", payload = [] }) => {
                    this.rulesController(correctDate, tab, payload, contentID, url);
                })
                .catch(() => {
                    this.setState({
                        data: null,
                        loading: false,
                    });
                });
        } else {
            this.contentFalse();
        }
    };

    changeLineContent = (param) => {
        this.setState({
            data: null,
            loading: true,
        }, () => {
            this.cancelRequests().then(() => {
                this.getData(param)
                    .then(this.getContent)
                    .then(({ date = "", payload = [] }) => {
                        const { companySlug, lineID, tab } = param;
                        const url = `/${companySlug}/content/${lineID}/${tab}`;
                        this.rulesController(date, tab, payload, null, url);
                    }).catch(this.setNoContent);
            });
        });
    };

    changeDateContent = (param) => {
        this.setState({
            data: null,
            loading: true,
        }, () => {
            this.cancelRequests().then(() => {
                this.getContent(param)
                    .then(({ payload }) => {
                        const { route: { companySlug, lineID, tab }, date } = param;
                        const url = `/${companySlug}/content/${lineID}/${tab}`;
                        this.rulesController(date, tab, payload, null, url);
                    }).catch(this.setNoContent);
            });
        });
    };

    async cancelRequests() {
        this.cancel.forEach((cancel) => {
            if (typeof cancel === "function") {
                cancel();
            }
        });
    }

    changeTabContent = (param) => {
        this.setState({
            data: null,
            loading: true,
        }, () => {
            this.cancelRequests().then(() => {
                this.getData(param, this.props.date)
                    .then(this.getContent)
                    .then(({ date = "", payload = [] }) => {
                        const { companySlug, lineID, tab } = param;
                        const url = `/${companySlug}/content/${lineID}/${tab}`;
                        this.rulesController(date, tab, payload, null, url);
                    }).catch(this.setNoContent);
            });
        });
    };

    async getData(route, date) {
        const { putDates } = this.props;
        try {
            const data = await this.getDates(route);
            let result = { route };
            if (data && data.payload.length > 0) {
                const { payload } = data;
                if (date) {
                    result = { ...result, date };
                } else if (route.date) {
                    result = { ...result, date: route.date };
                } else {
                    result = { ...result, date: payload[0] };
                }
                putDates(payload);
                return result;
            }
            const url = `/${route.companySlug}/content/${route.lineID}/${route.tab}`;
            this.contentFalse(url);
            return null;
        } catch (e) {
            console.error(e);
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

    getContent = async (res) => {
        const data = await new Promise((resolve, reject) => {
            if (!res) {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject(new Error("Oops"));
            } else {
                const { date, route: { lineID, tab } } = res;
                let params = { dateFrom: date };
                if (tab === "aeropanorama") {
                    params = {};
                }
                const promise = this.getContentData(params, lineID, tab);
                resolve(promise);
            }
        });
        if (data && Array.isArray(data.payload)) {
            if (data.payload.length > 0) {
                let result = data.payload;
                if (res.route.tab === "panorama") {
                    result = { panoramas: data.payload };
                    const params = { dateFrom: res.date };
                    const [images, videos] = await Promise.all([
                        this.getContentData(params, res.route.lineID, "image"),
                        this.getContentData(params, res.route.lineID, "video"),
                    ]);
                    if (images && Array.isArray(images.payload)) {
                        Object.assign(result, { media: [...images.payload] });
                    }
                    if (videos && Array.isArray(videos.payload)) {
                        Object.assign(result, { media: [...result.media, ...videos.payload] });
                    }
                    result = [result];
                }
                return { payload: result, date: res.date };
            }
            return { payload: [], date: res.date };
        }
    };

    getContentData = (params, lineID, tab) => {
        try {
            const url = `/user/api/lines/${lineID}/content/${tab}`;
            const [cancel, promise] = axios("get", url, params, true);
            this.cancel.push(cancel);
            return promise;
        } catch (e) {
            console.error(e);
            return [];
        }
    };

    rulesController = (correctDate, tab, payload, contentID, url) => {
        if (contentID && !TABS_WITHOUT_CONTENTID.includes(tab)) {
            let pIds = payload.map((item) => item.id);
            if (tab === "panorama") {
                pIds = payload[0].panoramas.map((item) => item.id);
            }
            if (pIds.includes(Number(contentID))) {
                url += `/${correctDate}/${contentID}`;
            } else {
                let id;
                if (tab === "panorama") {
                    id = payload[0].panoramas[0].id;
                } else {
                    [{ id }] = payload;
                }
                url += `/${correctDate}/${id}`;
            }
        } else if (!TABS_WITHOUT_CONTENTID.includes(tab) && payload.length > 0) {
            let id;
            if (tab === "panorama") {
                id = payload[0].panoramas[0].id;
            } else {
                [{ id }] = payload;
            }
            url += `/${correctDate}/${id}`;
        } else {
            url += `/${correctDate}`;
        }
        this.contentLoad(payload, correctDate, url);
    };

    contentLoad = (data, date, url) => {
        this.setState({
            data: data.length > 0 ? data : null,
            loading: false,
        }, () => {
            this.props.setContentData(this.state.data);
            if (date) {
                this.props.changeDate(date);
            }
            if (url) {
                this.setFreshURL(url);
            }
        });
    };

    contentFalse = (url) => {
        this.setState({
            data: null,
            loading: false,
        }, () => {
            this.props.putDates([]);
            if (url) {
                this.setFreshURL(url);
            }
        });
    };

    setFreshURL = (url) => {
        if (this.state.url === url) {
            return null;
        }
        this.setState({ url }, () => {
            this.props.history.replace(url);
        });
        return null;
    };

    checkNoMatchPath = (path) => {
        this.setState({
            url: path,
        });
    };

    setNoContent = (e) => {
        this.setState({ data: null, loading: false });
        // console.warn(e);
    };

    setContentPanorama = (id) => {
        const { pathname } = this.props.location;
        const {
            params: {
                companySlug, lineID, date, tab,
            },
        } = getContentController(pathname, ALL_MENU_ITEMS_ROUTES_V2);
        const url = `/${companySlug}/content/${lineID}/${tab}/${date}/${id}`;
        this.setFreshURL(url);
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
                    !data && route.tab !== "cameras" && route.tab !== "nomatch" && route.tab !== "model" ? (
                        <NoContent
                            changeDate={this.props.changeDate}
                            date={this.props.dates[0]}
                            route={route} />
                    ) : (
                        <TabView
                            setNoContent={this.setNoContent}
                            setContentId={this.setFreshURL}
                            setPanoramContent={this.setContentPanorama}
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
