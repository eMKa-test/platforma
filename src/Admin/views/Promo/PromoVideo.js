import get from "lodash/get";
import React from "react";
import * as PropTypes from "prop-types";
import {
    Card, CardBody, Button,
} from "reactstrap";
import EditPromo from "Admin/common/PromoEdit";
import DeleteModal from "Admin/common/DeleteModal";
import VideoPlayer from "../../../common/VideoPlayer";

class PromoVideo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isOpenDelete: false,
            filterSelected: [],
        };
    }

    componentDidMount() {
        this.setState({
            filterSelected: this.props.video.filterId,
        });
    }

    changeSelectFilter = (id) => {
        const { filterSelected } = this.state;
        let result = [...filterSelected];
        const checkFilter = result.find((filter) => filter === id);
        if (checkFilter) {
            result = result.filter((filter) => filter !== id);
        } else {
            result = result.concat(id);
        }
        this.setState({ filterSelected: result });
    };

    submitVideo = (ev) => {
        ev.preventDefault();
        ev.persist();
        const { video, section, currentCompany: { id } } = this.props;

        // Здесь будет массив строковых значений, имейте ввиду
        const available = get(ev, "target.filters.value", "").split(",");
        const filterId = Array.isArray(this.state.filterSelected)
            ? this.state.filterSelected.filter((selected) => {
                // Приведение к строке, см предыдущий комментарий
                return available.includes(String(selected));
            })
            : [];

        const newVideoParams = {
            ...video,
            date: get(ev, "target.dateFrom.value", null),
            description: get(ev, "target.description.value", ""),
            filterId,
        };
        this.props.putPromo(newVideoParams, { section, id });
        this.setState({ isOpen: false });
    };

    deleteContent = (ev) => {
        ev.preventDefault();
        ev.persist();
        const { video, section, currentCompany: { id } } = this.props;
        this.props.deletePromo(video.id, { section, companyId: id });
        this.setState({ isOpenDelete: false });
    };

    toggleModal = () => this.setState((state) => ({ isOpen: !state.isOpen }));

    toggleDeleteModal = () => this.setState((state) => ({ isOpenDelete: !state.isOpenDelete }));

    render() {
        const {
            video: content,
            currentCompany,
        } = this.props;
        const { isOpen, isOpenDelete, filterSelected } = this.state;
        return (
            <React.Fragment>
                <Card
                    className="select-map-preview-item"
                    style={{ backgroundColor: "#333" }}>
                    <CardBody className="image-thumb image-thumb_video">
                        <VideoPlayer
                            tmb={content.src.tmb && content.src.tmb}
                            className="VideoPreview"
                            src={content.src.src}
                            preload="metadata" />
                        <Button
                            className="content-edit-description-button"
                            color="light"
                            onClick={this.toggleModal}>
                            <i className="icon-pencil icons d-block" />
                        </Button>
                        <Button
                            className="content-delete-description-button"
                            color="light"
                            onClick={this.toggleDeleteModal}>
                            <i className="icon-trash icons d-block" />
                        </Button>
                        <p className="content-thumb-description">{content.description || ""}</p>
                    </CardBody>
                </Card>
                <EditPromo
                    title="Редактирование контента"
                    contentId={content.id}
                    isOpen={isOpen}
                    defaultDescription={content.description}
                    defaultDateFrom={content.date}
                    defaultTmb={content.src.tmb}
                    toggleModal={this.toggleModal}
                    currentCompany={currentCompany}
                    filterId={content.filterId}
                    filterSelected={filterSelected}
                    changeSelectFilter={this.changeSelectFilter}
                    submit={this.submitVideo} />
                <DeleteModal
                    isOpen={isOpenDelete}
                    toggleModal={this.toggleDeleteModal}
                    submit={this.deleteContent} />
            </React.Fragment>
        );
    }
}

PromoVideo.propTypes = {
    video: PropTypes.object,
    section: PropTypes.string,
    putPromo: PropTypes.func.isRequired,
    deletePromo: PropTypes.func,
    currentCompany: PropTypes.object.isRequired,
};

export default PromoVideo;
