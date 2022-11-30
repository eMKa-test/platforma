import React, { Component } from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import RSC from "react-scrollbars-custom";
import Spinner from "../spinner";
import HorizontalSlider from "./horizontalSlider";
import { getData } from "../../../ContentProvider/fetch";
import styles from "./styles";
import { RightsConsumer } from "../../providers/Rights";

class PromoMaterial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            filters: [],
            media: [],
        };
    }

    componentDidMount() {
        this.fetchMedia();
    }

    fetchMedia = () => {
        const { currentCompany } = this.props;
        const companyID = currentCompany ? currentCompany.id : 0;
        this.setState({
            loading: true,
        }, async () => {
            try {
                const [{ payload: filters }, { payload: media }] = await Promise.all([
                    getData({ url: `/user/api/companies/${companyID}/promoFilter/` }),
                    getData({
                        url: `/user/api/companyContent/${companyID}/promo`,
                        params: {
                            limit: 100,
                        },
                    }),
                ]);
                this.setState({
                    filters,
                    media,
                    loading: false,
                });
            } catch (e) {
                warn(e);
                this.setState({ loading: false });
            }
        });
    };

    render() {
        if (this.state.loading) {
            return (
                <Spinner />
            );
        }
        const { filters, media } = this.state;
        const { classes } = this.props;
        return (
            <RightsConsumer>
                {({currentCompany}) => (
                    <RSC
                        trackYProps={{ className: classes.trackY }}
                        thumbYProps={{ className: classes.thumbY }}>
                        <HorizontalSlider
                            currentCompany={currentCompany}
                            title="Без фильтров"
                            mediaData={media.filter((m) => m.filterId.length < 1)} />
                        {filters.map((f) => (
                            <HorizontalSlider
                                key={f.id}
                                title={f.title}
                                currentCompany={currentCompany}
                                filter={f}
                                mediaData={media.filter((m) => m.filterId.includes(f.id))} />
                        ))}
                    </RSC>
                )}
            </RightsConsumer>
        );
    }
}

PromoMaterial.propTypes = {
    currentCompany: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PromoMaterial);
