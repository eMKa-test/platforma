import React from "react";
import * as PropTypes from "prop-types";
import { Card, CardHeader, CardBody } from "reactstrap";

function ConfigCard({ children, data }) {
    const { name, description } = data;
    return (
        <Card>
            <CardHeader className="px-2 pt-2 pb-1">
                <div className="h5 mb-1">
                    {name}
                </div>
                <small
                    className="d-block mb-2 text-muted font-weight-bold">
                    {description}
                </small>
            </CardHeader>
            <CardBody className="p-1">
                {children}
            </CardBody>
        </Card>
    );
}

ConfigCard.propTypes = {
    data: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }),
    children: PropTypes.node,
};

export default React.memo(ConfigCard);
