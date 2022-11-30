import React from "react";
import * as PropTypes from "prop-types";
import axios from "../../common/axios";
import NoContent from "../noContent";
import Spinner from "../spinner";
import { sortPans } from "./helper";

function dataHoc(Component) {
    return class DataHoc extends React.Component {
        static propTypes = {
            putDates: PropTypes.func.isRequired,
            routeParams: PropTypes.object.isRequired,
            changeDate: PropTypes.func.isRequired,
            date: PropTypes.string.isRequired,
            history: PropTypes.object.isRequired,
        };

        constructor(props) {
            super(props);
            this.state = {
                data: null,
                loading: true,
                lineID: null,
            };
        }

        cancel = [];

        componentDidMount() {
            const { routeParams: { date, contentID }, changeDate } = this.props;
            if (contentID) {
                changeDate(date);
            }
            this.launchData(date);
        }

        componentDidUpdate(prevProps, prevState) {
            const { routeParams, routeParams: { tab }, date } = this.props;
            if ((prevProps.routeParams.tab !== tab || (prevProps.date !== date && routeParams.date !== date)) && tab !== "aeropanorama") {
                this.launchData();
            }
            if (prevProps.lineId !== this.props.lineId || this.state.lineID !== this.props.lineId) {
                this.launchDataFromNewLine(this.props.lineId);
            }
        }

        componentWillUnmount = () => {
            this.cancel.forEach((cancel) => {
                if (typeof cancel === "function") {
                    cancel();
                }
            });
        };

        launchData = (date = this.props.date) => {
            this.setState({
                loading: true,
                data: null,
                lineID: this.props.lineId,
            }, async () => {
                const { putDates, routeParams } = this.props;
                let datas = await this.fetchData(date);
                if (datas) {
                    putDates(datas.dates);
                    if (datas.content.length > 0) {
                        if (routeParams.tab === "panorama") {
                            const panoramContent = await this.getPanoramData(datas.content, routeParams, date);
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
                } else {
                    putDates([]);
                    this.setState({
                        data: null,
                        loading: false,
                    });
                }
            });
        };

        launchDataFromNewLine = async (lineID = "") => {
            const { putDates, changeDate, routeParams: { companySlug, tab } } = this.props;
            this.setState({ lineID });
            const data = await this.getDates({ tab, lineID });
            if (data.payload && data.payload.length > 0) {
                const date = data.payload[0];
                putDates(data.payload);
                changeDate(date);
            } else {
                const date = moment().subtract(1, "day").format("YYYY-MM-DD");
                const url = `/${companySlug}/content/${lineID}/${tab}/${date}`;
                putDates([]);
                changeDate(date);
                this.props.history.replace(url);
            }
        };

        async fetchData(date) {
            try {
                const { routeParams } = this.props;
                const [dates, content] = await Promise.all([
                    this.getDates(routeParams),
                    this.getContent(routeParams, date),
                ]);
                return {
                    dates: dates.payload,
                    content: content.payload,
                };
            } catch (e) {
                return null;
            }
        }

        async getPanoramData(data, routeParams, date) {
            data.sort(sortPans);
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

        getDates = ({ tab, lineID }) => {
            let curTab = tab;
            if (tab === "aeropanorama") {
                curTab = "panorama";
            }
            const [cancel, promise] = axios("get", `/user/api/lines/${lineID}/content/${curTab}/calendar/`, null, true);
            this.cancel.push(cancel);
            return promise;
        };

        getContent = ({ tab, lineID }, date, type) => {
            let url = `/user/api/lines/${lineID}/content/${type || tab}?dateFrom=${date}`;
            if (tab === "aeropanorama") {
                url = `/user/api/lines/${lineID}/content/${type || tab}`;
            }
            const [cancel, promise] = axios("get", url, null, true);
            this.cancel.push(cancel);
            return promise;
        };

        render() {
            const { loading, data } = this.state;
            if (loading) {
                return <Spinner />;
            }
            return (
                <React.Fragment>
                    {
                        !data ? (
                            <NoContent />
                        ) : (
                            <Component
                                media={data}
                                {...this.props} />
                        )
                    }
                </React.Fragment>
            );
        }
    };
}

export default dataHoc;
