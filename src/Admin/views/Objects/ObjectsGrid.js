import React from "react";
import * as PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { Col, Row, Button } from "reactstrap";

import placeholder from "assets/placeholders/obj.jpg";

import Widget from "Admin/common/Widget";

function ObjectsGrid(props) {
    return (
        <Row className="mt-3">
            {Array.isArray(props.objects) &&
            props.objects.map((object) => (
                <Col
                    className="mb-3"
                    xs={12}
                    sm={6}
                    md={4}
                    xl={3}
                    key={object.id}
                    style={{ overflow: "hidden" }}>
                    <NavLink to={`/admin/companies/${props.companyID}/${object.id}`}>
                        <Widget
                            className="linesStyles"
                            image={object.image ? object.image.tmb : placeholder}
                            title={object.name}
                            description={object.description} />
                    </NavLink>
                    <Button
                        className="deleteBtn"
                        color="light"
                        onClick={() => props.toggleDeleteModal(object.id)}>
                        <i className="icon-trash icons icon-trash-style" />
                    </Button>
                </Col>
            ))}
        </Row>
    );
}

ObjectsGrid.propTypes = {
    companyID: PropTypes.number,
    toggleDeleteModal: PropTypes.func,
    objects: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            image: PropTypes.shape({}),
        }),
    ),
};

export default React.memo(ObjectsGrid);
