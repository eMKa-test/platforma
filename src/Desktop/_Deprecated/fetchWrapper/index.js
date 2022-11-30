import React from "react";
import axios, { cancel } from "../../common/axios";
import { sortPans } from "./helpers";
import Loader from "../loader";

function FetchWrapper(Component) {
    return class extends React.Component {
        state = {
            loader: true,
            data: null,
        };

        componentDidMount() {
            const { lineID, date } = this.props;
            if (lineID && date) {
                this.getData(date, lineID);
            }
        }

        componentDidUpdate(prevProps) {
            const { lineID, date } = this.props;
            if (lineID) {
                if (prevProps.date !== date || prevProps.lineID !== lineID) {
                    this.getData(date, lineID);
                }
            }
        }

        componentWillUnmount() {
            cancel("Canceled pan");
        }

        getData = (date, lineID) => {
            this.setState({
                loader: true,
                data: null,
            }, async () => {
                const pano = await this.fetchPanorama(lineID, date);
                if (pano.length > 0) {
                    pano.sort(sortPans);
                    let data = {
                        panoramas: pano,
                    };
                    const [images, videos] = await Promise.all([
                        // eslint-disable-next-line no-underscore-dangle
                        this._fetchData(lineID, date, "image"),
                        // eslint-disable-next-line no-underscore-dangle
                        this._fetchData(lineID, date, "video"),
                    ]);
                    data = {
                        ...data,
                        media: [
                            ...images,
                            ...videos,
                        ],
                    };
                    return this.setState({
                        data,
                        loader: false,
                    });
                }
                this.setState({
                    data: null,
                    loader: false,
                });
            });
        };

        async fetchPanorama(lineID, date) {
            try {
                const [pano] = await Promise.all([
                    // eslint-disable-next-line no-underscore-dangle
                    this._fetchData(lineID, date, "panorama"),
                ]);
                return pano;
            } catch (e) {
                console.warn(e, "pans error");
                return [];
            }
        }

        _fetchData = (lineID, date, contentType) => {
            const url = `/user/api/lines/${lineID}/content/${contentType}`;
            return axios("get", url, { dateFrom: date })
                .then(({ payload }) => {
                    if (payload.length > 0) {
                        return payload;
                    }
                    return [];
                });
        };

        render() {
            if (this.state.loader) {
                return <Loader />;
            }
            if (!this.state.loader && !this.state.data) {
                return (
                    <p align="center">
                        Панорамы отсутствуют
                    </p>
                );
            }
            return (
                <Component {...this.state.data} />
            );
        }
    };
}

export default FetchWrapper;
