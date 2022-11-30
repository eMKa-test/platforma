import React from "react";
import * as PropTypes from "prop-types";
import get from "lodash/get";
import { matchPath } from "react-router-dom";
import { getData, postData } from "api";
import Header from "Admin/common/Header";
import LinesEditModal from "Admin/common/LinesEditModal";
import ContentTabs from "./ContentTabs";
import { ruleOfChangeMeta } from "../../components/AeroCreatePanorama/helper";

class LineEdit extends React.Component {
    static propTypes = {
        currentLine: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string,
            image: PropTypes.object,
            gps: PropTypes.shape({
                lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
                long: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            }),
            agentPlans: PropTypes.shape({
                points: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
                photos: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
                videos: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
                panoramas: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            }),
        }).isRequired,
        getLineByID: PropTypes.func.isRequired,
        putLine: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            objectID: -1,
            isOpen: false,
            dates: [],
            dateFrom: null,
            lineID: -1,
            contentType: "image",
            uploadUrl: "",
            loading: true,
            loadedContent: false,
            accessSublines: [],
            bg: { backgroundImage: "none" },
        };
    }

    componentDidMount() {
        const { params, params: { objectID, lineID } } = matchPath(get(this.props, "location.pathname"), {
            path: ["/admin/objects/:objectID/:lineID", "/admin/companies/:companyID/:objectID/:lineID"],
        });
        const uploadUrl = `/admin/api/projects/${objectID}/lines/${lineID}/content/`;
        this.setState({ objectID: params.objectID, lineID: params.lineID, uploadUrl }, () => {
            this.props.getLineByID({
                objectID: params.objectID,
                id: params.lineID,
            }); this.fetchCalendar();
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const image = get(nextProps, "currentLine.image", false);
        if (image && this.state.bg.backgroundImage !== image.src) {
            this.setState({ bg: { backgroundImage: `url('${image.src}')` } });
        } else {
            this.setState({ bg: { backgroundImage: "none" } });
        }
        return null;
    }

    componentWillUnmount() {
        this.props.clearMemory();
    }

    submitLine = (ev) => {
        ev.preventDefault();
        ev.persist();
        if (ev.target.name.value !== "" && ev.target.description.value !== "") {
            this.setState({ isOpen: false }, () => this.props.putLine({
                objectID: this.state.objectID,
                line: {
                    id: this.props.currentLine.id,
                    name: ev.target.name.value,
                    description: ev.target.description.value,
                    gps: {
                        lat: ev.target.lat.value,
                        long: ev.target.long.value,
                    },
                    agentPlans: {
                        points: ev.target.planPoints.value,
                        photos: ev.target.planPhotos.value,
                        videos: ev.target.planVideos.value,
                        panoramas: ev.target.planPanoramas.value,
                    },
                    orderWeight: ev.target.orderWeight.value,
                },
            }));
        }
    };

    toggleModal = () => this.setState((prevState) => ({ isOpen: !prevState.isOpen }));

    fetchCalendar = (contentType = this.state.contentType) => {
        this.setState({
            loadedContent: false,
            loading: true,
            dateFrom: null,
        }, () => {
            const { objectID, lineID } = this.state;
            getData({
                mainUrl: `/admin/api/projects/${objectID}/lines/${lineID}/content/${contentType}/calendar`,
            }).then(({ payload: dates }) => {
                const dateFrom = dates.length > 0 ? dates[0] : null;
                this.setState({ dates: dates.map((date) => moment(date).toString()), dateFrom }, () => {
                    this.setState(() => ({ loading: false, loadedContent: true }));
                });
            });
        });
    };

    handleChangeDate = (dateFrom) => {
        this.setState(() => ({ dateFrom: moment(dateFrom).format("YYYY-MM-DD") }));
    };

    setContentType = (val) => this.setState({ contentType: val });

    checkChangeSublines = (changedSublineList, id) => {
        this.checkChangeSublinesd(changedSublineList, this.state.uploadUrl, id);
    };

    loaderContent = (loading, loadedConent, dateFrom) => this.setState({ loading, loadedConent, dateFrom: dateFrom || this.state.dateFrom });

    async checkChangeSublinesd(changedSublineList, uploadUrl, subId) {
        const panoramas = await this.getAeroPanoramas(uploadUrl);
        if (panoramas) {
            const subsIndexes = changedSublineList.map((sub) => sub.id);
            const result = panoramas.map((pan) => {
                let newMeta;
                const meta = JSON.parse(pan.meta);
                if (meta && meta.sublines) {
                    let res = meta.sublines;
                    meta.sublines.forEach(({ id }) => {
                        if (subsIndexes.includes(subId)) {
                            res = meta.sublines.filter((exclMet) => exclMet.id !== subId);
                        }
                    });
                    newMeta = ruleOfChangeMeta(meta, res, "sublines");
                }
                return {
                    mainUrl: `${uploadUrl}aeropanorama/${pan.id}`,
                    body: {
                        ...pan,
                        meta: newMeta,
                    },
                };
            });
            this.applyChanges(result);
        }
        return null;
    }

    async applyChanges(panoramas) {
        const result = [];
        // eslint-disable-next-line no-unreachable
        for (let i = 0; i < panoramas.length; i += 1) {
            const { mainUrl, body } = panoramas[i];
            result.push(postData({ mainUrl, body }));
        }
        await Promise.all(result);
    }

    async getAeroPanoramas(uploadUrl) {
        try {
            const data = await getData({
                mainUrl: `${uploadUrl}aeropanorama`,
            });
            if (data.success && data.payload.length > 0) {
                return data.payload;
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    addedSublines = (accessSublines) => this.setState({ accessSublines });

    render() {
        const { currentLine } = this.props;
        let { gps, agentPlans } = currentLine;
        if (!gps) gps = { lat: "", long: "" };
        if (!agentPlans) {
            agentPlans = {
                points: "",
                photos: "",
                videos: "",
                panoramas: "",
            };
        }
        const { isOpen, objectID, uploadUrl, contentType } = this.state;
        return (
            <React.Fragment>
                <Header
                    linesHeader
                    contentType={contentType}
                    checkChangeSublines={this.checkChangeSublines}
                    addedSublines={this.addedSublines}
                    line={currentLine}
                    onClickEdit={this.toggleModal}
                    title={currentLine.name}
                    description={currentLine.description}
                    image={currentLine.image}
                    uploadUrl={`/admin/api/projects/${objectID}/lines/${currentLine.id}/upload/`} />
                {
                    currentLine.id > -1 && uploadUrl && (
                        <ContentTabs
                            {...this.state}
                            {...this.props}
                            loaderContent={this.loaderContent}
                            currentLine={currentLine}
                            handleChangeDate={this.handleChangeDate}
                            setContentType={this.setContentType}
                            reloadCalendar={this.fetchCalendar} />
                    )
                }
                <LinesEditModal
                    edit
                    title="Редактирование отрезка"
                    isOpen={isOpen}
                    defaultName={currentLine.name}
                    defaultDescription={currentLine.description}
                    defaultOrderWeight={currentLine.orderWeight}
                    defaultLat={gps.lat}
                    defaultLong={gps.long}
                    defaultPlanPoints={agentPlans.points}
                    defaultPlanPhotos={agentPlans.photos}
                    defaultPlanVideos={agentPlans.videos}
                    defaultPlanPanoramas={agentPlans.panoramas}
                    withAgentPlans
                    toggleModal={this.toggleModal}
                    submit={this.submitLine} />
            </React.Fragment>
        );
    }
}

export default LineEdit;
