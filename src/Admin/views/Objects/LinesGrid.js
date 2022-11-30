import React from "react";
import * as PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { Col, Row, Button } from "reactstrap";

import palceholder from "assets/placeholders/obj.jpg";

import Widget from "Admin/common/Widget";

const LinesGrid = (props) => {
    return (
        <Row className="mt-3">
            {Array.isArray(props.lines) &&
            props.lines.map((line) => {
                const to = props.currentType
                    ? `/admin/companies/${props.currentType}/${props.objectID}/${line.id}`
                    : `/admin/objects/${props.objectID}/${line.id}`;
                return (
                    <Col
                        className="mb-3"
                        xs={12}
                        sm={6}
                        md={4}
                        xl={3}
                        key={line.id}
                        style={{overflow: "hidden"}}>
                        <NavLink to={to}>
                            <Widget
                                className="linesStyles"
                                image={line.image ? line.image.tmb : palceholder}
                                title={line.name}
                                description={line.description} />
                        </NavLink>
                        <Button
                            className="deleteBtn"
                            color="light"
                            onClick={() => props.toggleDeleteModal(line.id)}>
                            <i className="icon-trash icons icon-trash-style" />
                        </Button>
                    </Col>
                )
            })}
        </Row>
    );
}

LinesGrid.propTypes = {
    objectID: PropTypes.number,
    currentType: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]).isRequired,
    toggleDeleteModal: PropTypes.func,
    lines: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            image: PropTypes.shape({}),
        }),
    ),
};

export default LinesGrid;
