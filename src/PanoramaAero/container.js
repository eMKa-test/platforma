import React from "react";
import { withRouter, useParams } from "react-router";
import PropTypes from "prop-types";
import AeroPanorama from "./aeroPanorama";

const AeroContainer = ({
    media,
    setSublineMode,
    setContentId,
    routeParams,
    date,
    sublineMode,
    ...other
}) => {
    const { contentID } = useParams();
    if (!contentID) {
        return null;
    }
    return (
        <AeroPanorama
            {...other}
            sublineMode={sublineMode}
            media={media}
            setSublineMode={setSublineMode}
            setContentId={setContentId}
            routeParams={routeParams}
            date={date}
            contentID={contentID} />
    );
};

AeroContainer.propTypes = {
    setContentId: PropTypes.func.isRequired,
    sublineMode: PropTypes.bool.isRequired,
    setSublineMode: PropTypes.func.isRequired,
    media: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    routeParams: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
};

export default withRouter(AeroContainer);
