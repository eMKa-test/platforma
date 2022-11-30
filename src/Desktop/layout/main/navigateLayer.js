import React from "react";
import * as PropTypes from "prop-types";
import { ACCESS_ROUTE_TABS_FOR_MAP_V2, MODEL_LINES_ACCESS } from "../../../constants";
import { LoaderConsumer } from "../../providers/ContentLoader";

const MapLayer = React.lazy(() => import("../../components/mapLayer"));
const ModelLayer = React.lazy(() => import("../../components/modelLayer"));

class ToggleLayers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate(prevProps) {
        if (prevProps.modeMap !== this.props.modeMap && this.props.modeMap && this.props.modeModel) {
            this.props.showModel(false);
        }
        if (prevProps.modeModel !== this.props.modeModel && this.props.modeModel && this.props.modeMap) {
            this.props.showMap(false);
        }
    }

    render() {
        const {
            params, currentCompany, modeMap, showMap, ...other
        } = this.props;
        return (
            <React.Suspense fallback={<span />}>
                {currentCompany.projects && ACCESS_ROUTE_TABS_FOR_MAP_V2.includes(params.tab) && (
                    <MapLayer
                        projects={currentCompany.projects}
                        showMap={showMap}
                        params={params}
                        modeMap={modeMap} />
                )}
                {
                    MODEL_LINES_ACCESS.includes(params.lineID) && (
                        <LoaderConsumer>
                            {
                                ({ contentData }) => (
                                    <ModelLayer
                                        contentData={contentData}
                                        params={params}
                                        {...other} />
                                )
                            }
                        </LoaderConsumer>
                    )
                }
            </React.Suspense>
        );
    }
}

ToggleLayers.propTypes = {
    modeModel: PropTypes.bool.isRequired,
    modeMap: PropTypes.bool.isRequired,
    showMap: PropTypes.func.isRequired,
    cacheModel: PropTypes.object.isRequired,
    setCacheModel: PropTypes.func.isRequired,
    showModel: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    currentCompany: PropTypes.object.isRequired,
};

export default ToggleLayers;
