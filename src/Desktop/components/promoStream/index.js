import React, { Component } from "react";
import * as PropTypes from "prop-types";
import Gallery from "../gallery";
import axios from "../../common/axios";
import { PROMO, STREAM } from "../../../constants";
import Spinner from "../spinner";

class PromoStream extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            videos: [],
        };
    }

    componentDidMount() {
        this.fetchMedia();
    }

    fetchMedia = () => {
        const { currentCompany } = this.props;
        const contentType = currentCompany ? currentCompany.id : 0;
        this.setState({
            loading: true,
            videos: [],
        }, () => {
            axios("get", PROMO.contentUrl(contentType, "stream"))
                .then((data) => {
                    if (data.payload.length > 0) {
                        this.setState({ videos: data.payload, loading: false });
                    } else {
                        this.setState({ loading: false });
                    }
                }).catch(() => {
                    this.setState({ loading: false });
                });
        });
    };

    render() {
        if (this.state.loading) {
            return (
                <Spinner />
            );
        }
        const { videos } = this.state;

        return (
            <Gallery
                media={videos}
                isStream
                contentType={STREAM} />
        );
    }
}

PromoStream.propTypes = {
    currentCompany: PropTypes.object.isRequired,
};

export default PromoStream;
