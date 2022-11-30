import React from "react";
import * as PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { Button, Card, CardBody } from "reactstrap";

import CompanyThumb from "../views/Companies/CompanyThumb";
import VideoBackground from "../views/Companies/VideoBackground";

function HeaderCompany(props) {
    const {
        onClickEdit, title, contents, id,
    } = props;
    return (
        <div className="mb-5">
            <div className="row d-flex justify-content-between mb-5">
                <div className="col-md-12 col-xl-4">
                    <div className="d-flex align-items-center">
                        <div className="mr-3">
                            <Button
                                className="mb-2"
                                color="light"
                                onClick={onClickEdit}>
                                <i className="icon-pencil icons d-block" />
                            </Button>
                        </div>
                        <h1 className="h3 mb-2">{title}</h1>
                    </div>
                </div>
                <div className="col-md-5 col-xl-4">
                    <VideoBackground
                        video={props.video}
                        uploadUrl={props.uploadUrl} />
                </div>
                <div className="col-md-5 col-xl-4">
                    <CompanyThumb
                        image={props.image}
                        uploadUrl={props.uploadUrl} />
                </div>
            </div>
            <div
                className="row d-flex justify-content-start mb-3"
                style={{ height: "13rem" }}>
                {Array.isArray(contents) && (
                    contents.map((content) => (
                        <div
                            key={content}
                            className="mb-3 col-12 col-sm-6 col-md-4 col-xl-3">
                            <Card className="mb-0">
                                <NavLink to={`/admin/companies/${id}/${content.toLowerCase()}`}>
                                    <CardBody
                                        className="image-thumb cursor-pointer">
                                        {content}
                                    </CardBody>
                                </NavLink>
                            </Card>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

HeaderCompany.propTypes = {
    onClickEdit: PropTypes.func,
    contents: PropTypes.array,
    title: PropTypes.string,
    image: PropTypes.object,
    video: PropTypes.object,
    id: PropTypes.number,
    uploadUrl: PropTypes.string,
};

export default React.memo(HeaderCompany);
