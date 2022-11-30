import React from "react";
import * as PropTypes from "prop-types";
import { Button } from "reactstrap";
import { postData, getData } from "api";
import SublinesCreateInputs from "./SublinesCreateInputs";
import SublinesList from "./SublinesList";
import SublineMap from "./SublineMap";
import ResponseInfo from "../../../Desktop/common/ResponseInfo";
import { ruleOfAddmetaPolygon } from "../AeroCreatePanorama/helper";

class SubLinesCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sublines: [],
            sublinesList: [],
            openMapForSubline: false,
            selectedSubline: null,
            response: {
                open: false,
                success: false,
                title: "",
            },
        };
    }

    componentDidMount() {
        this.getSublinesList();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.line.id !== this.props.line.id) {
            this.getSublinesList();
        }
        if (prevState.response.open !== this.state.response.open && this.state.response.open) {
            this.closeResponseInfo();
        }
    }

    getSublinesList = () => {
        const { line } = this.props;
        const url = `/admin/api/lines/${line.id}/sublines`;
        this.setState({ sublinesList: [] }, () => {
            getData({ mainUrl: url }).then((res) => {
                this.props.addedSublines(res.payload);
                this.setState({
                    sublinesList: res.payload,
                });
            });
        });
    };

    createSubline = () => {
        const newSubLine = {
            id: this.state.sublines.length,
            title: "",
            description: "",
        };
        this.setState((state) => ({
            sublines: state.sublines.concat(newSubLine),
        }));
    };

    onChangeSubLine = (id, type) => ({ target: { value } }) => {
        const changes = {
            id,
            [type]: value,
        };
        const test = [...this.state.sublines];
        test[id] = {
            ...test[id],
            ...changes,
        };
        this.setState(() => ({
            sublines: test,
        }));
    };

    submitSublines = (id) => () => {
        const subline = this.state.sublines[id];
        if (!subline.title && !subline.description) {
            return null;
        }
        const { line } = this.props;
        const url = `/admin/api/lines/${line.id}/sublines`;
        postData({
            mainUrl: url,
            body: {
                title: subline.title,
                description: subline.description,
            },
        }).then(() => {
            this.getSublinesList();
            this.onDelete(id)();
        });
    };

    onDelete = (id) => () => {
        let sublines = [...this.state.sublines];
        sublines.splice(id, 1);
        sublines = sublines.map((sub, i) => {
            return { ...sub, id: i };
        });
        this.setState({ sublines });
    };

    setCenterForSubline = (selectedSubline, openMapForSubline) => () => {
        this.setState({ openMapForSubline, selectedSubline });
    };

    onSubmitSublineCenter = (coords, callback) => () => {
        const { line } = this.props;
        const { selectedSubline } = this.state;
        const url = `/admin/api/lines/${line.id}/sublines/${selectedSubline.id}`;
        postData({
            mainUrl: url,
            body: {
                ...selectedSubline,
                gps: {
                    lat: coords[0],
                    long: coords[1],
                },
            },
        });
        this.getAeropanorams(selectedSubline.id, coords).then(() => {
            this.setState({
                response: {
                    open: true,
                    success: true,
                    title: "Центр зоны успешно задан",
                },
            });
            callback();
            this.setCenterForSubline(null, false)();
            this.getSublinesList();
        }).catch((e) => {
            this.setState({
                response: {
                    open: true,
                    success: false,
                    title: "Ошибка, попробуйте ещё раз",
                },
            });
        });
    };

    async getAeropanorams(ID, coord) {
        const { line: { projectId, id } } = this.props;
        const url = `/admin/api/projects/${projectId}/lines/${id}/content/aeropanorama`;
        await getData({ mainUrl: url }).then(async ({ payload }) => {
            const result = [];
            for (const aero of payload) {
                if (aero.meta) {
                    try {
                        const meta = JSON.parse(aero.meta);
                        if (meta.sublinePolygons && meta.sublinePolygons.length > 0) {
                            for (const sMeta of meta.sublinePolygons) {
                                if (sMeta.id === ID) {
                                    const coords = { lat: coord[0], long: coord[1] };
                                    const {
                                        id: sId, title, meta: smeta, params,
                                    } = sMeta;
                                    const newMeta = ruleOfAddmetaPolygon(meta, sId, title, smeta, coords, params);
                                    const body = { ...aero, meta: newMeta };
                                    const mainUrl = `/admin/api/projects/${projectId}/lines/${id}/content/aeropanorama/${aero.id}`;
                                    result.push(postData({ mainUrl, body }));
                                }
                            }
                        }
                    } catch (e) {
                        console.warn(e, "Error parse aero meta");
                    }
                }
            }
            await Promise.all(result);
        });
    }

    closeResponseInfo = () => {
        setTimeout(() => {
            this.setState((state) => ({
                response: {
                    ...state.response,
                    open: false,
                },
            }));
        }, 1000);
    };

    render() {
        const { sublines, sublinesList, openMapForSubline, selectedSubline, response } = this.state;
        const { line, checkChangeSublines } = this.props;
        return (
            <div className="row no-gutters d-flex">
                <ResponseInfo {...response} />
                <div className="col-10">
                    <Button
                        className="mb-1"
                        outline
                        color="primary"
                        title="Добавить зону"
                        onClick={this.createSubline}>
                        <i className="fa fa-plus" />
                    </Button>
                    {
                        openMapForSubline && (
                            <div className="header-subline-map-container">
                                <SublineMap
                                    selectedSubline={selectedSubline}
                                    sublinesList={sublinesList}
                                    line={line}
                                    onSubmitSublineCenter={this.onSubmitSublineCenter}
                                    setCenterForSubline={this.setCenterForSubline} />
                            </div>
                        )
                    }
                    {
                        sublines.map((sub, i) => (
                            <SublinesCreateInputs
                                key={i}
                                index={i}
                                id={sub.id}
                                title={sub.title}
                                description={sub.description}
                                onClick={this.submitSublines(i)}
                                onDelete={this.onDelete(i)}
                                onChange={this.onChangeSubLine} />
                        ))
                    }
                    <SublinesList
                        selectedSubline={selectedSubline}
                        setCenterForSubline={this.setCenterForSubline}
                        checkChangeSublines={checkChangeSublines}
                        getSublinesList={this.getSublinesList}
                        list={sublinesList}
                        line={line} />
                </div>
            </div>
        );
    }
}

SubLinesCreate.propTypes = {
    line: PropTypes.object.isRequired,
    addedSublines: PropTypes.func.isRequired,
    checkChangeSublines: PropTypes.func.isRequired,
};

export default SubLinesCreate;
