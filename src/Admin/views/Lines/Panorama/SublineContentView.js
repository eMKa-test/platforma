import React from "react";
import * as PropTypes from "prop-types";
import { postData } from "api";
import { getData } from "ContentProvider/fetch";
import { FormGroup, Input } from "reactstrap";
import { collectMarkers } from "../../../components/SublinesCorrect/helper";

class SublinesContentView extends React.Component {
    static propTypes = {
        selectedSublineMarkers: PropTypes.arrayOf(PropTypes.number),
        lineID: PropTypes.string.isRequired,
        dateFrom: PropTypes.string.isRequired,
        uploadUrl: PropTypes.string.isRequired,
        setPanProp: PropTypes.func.isRequired,
        tabLoader: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            sublineList: [],
            selectedSubline: null,
            aeroPanoramas: [],
            submitInfo: null,
        };
    }

    cancel = [];

    componentDidMount() {
        this.fetchAll();
    }

    componentWillUnmount() {
        if (this.cancel.length > 0) {
            this.cancel.forEach((cancel) => {
                if (cancel && typeof cancel === "function") {
                    cancel();
                }
            });
        }
        this.props.tabLoader.maps(true);
    }

    fetchAll() {
        const { uploadUrl, lineID } = this.props;
        const ulrAero = uploadUrl;
        const ulrSubline = `/admin/api/lines/${lineID}/sublines`;
        Promise.all([
            this.fetchData(ulrAero),
            this.fetchData(ulrSubline),
        ]).then(([aero, subline]) => {
            if (aero && subline) {
                this.setState({
                    sublineList: subline.payload,
                    aeroPanoramas: aero.payload,
                });
            }
        });
    }

    async fetchData(url, params) {
        try {
            const [promise, cancel] = getData({ url, params }, true);
            this.cancel.push(cancel);
            return promise;
        } catch (e) {
            console.warn("Wrong request in SublineCIntentView Component...", e);
            return [];
        }
    }

    deleteMarkerFromList = (id) => () => {
        const { setPanProp, selectedSublineMarkers } = this.props;
        setPanProp("selectedSublineMarkers", collectMarkers(selectedSublineMarkers, id));
    };

    renderList = (list) => (
        list.map((content) => (
            <div
                key={content}
                className="sublines-content-view__list-item">
                <p className="m-0 p-0">
                    {
                        `ID: ${content}`
                    }
                </p>
                <button
                    onClick={this.deleteMarkerFromList(content)}
                    type="button">
                    <i className="fa fa-close d-block" />
                </button>
            </div>
        ))
    );

    selectSubline = ({ target: { value } }) => {
        this.setState({ selectedSubline: Number(value) });
    };

    updateAeroMeta = (selectedSublineId, curSub) => {
        const { aeroPanoramas } = this.state;
        const { uploadUrl } = this.props;
        aeroPanoramas.forEach((pan) => {
            if (pan.meta) {
                const meta = JSON.parse(pan.meta);
                const newMeta = { ...meta };
                if (meta && meta.sublines) {
                    const result = meta.sublines.map((sub) => {
                        if (sub.id === curSub.id) {
                            return {
                                ...sub,
                                meta: curSub.meta,
                            };
                        }
                        return sub;
                    });
                    newMeta.sublines = result;
                    const body = {
                        ...pan,
                        meta: JSON.stringify(newMeta),
                    };
                    const mainUrl = `${uploadUrl}aeropanorama/${pan.id}`;
                    postData({ mainUrl, body });
                }
            }
        });
    };

    submitContentSubline = () => {
        if (this.state.selectedSubline) {
            const { lineID, dateFrom } = this.props;
            const mainUrl = "/admin/api/content/linkSubline";
            const body = {
                sublineId: this.state.selectedSubline,
                contents: this.props.selectedSublineMarkers,
                date: dateFrom,
                lineId: Number(lineID),
            };
            postData({
                mainUrl,
                body,
            }).then(() => {
                this.setSubmitInfo(true);
                setTimeout(() => {
                    this.props.setPanProp("selectedSublineMarkers", []);
                    this.setState({ submitInfo: null });
                }, 700);
            }).catch((e) => {
                console.warn(e);
                this.setSubmitInfo();
            });
        } else {
            alert("Не выбрана привязываемая зона");
        }
    };

    setSubmitInfo = (success) => {
        if (success) {
            return this.setState({
                submitInfo: {
                    success: true,
                    title: "Привязка завершена",
                },
            });
        }
        return this.setState({
            submitInfo: {
                success: false,
                title: "Привязка не удалась. Попробуйте позже",
            },
        });
    };

    renderSublineSelect = (list) => (
        <FormGroup className="mb-2">
            <Input
                onChange={this.selectSubline}
                type="select"
                name="sublinesList"
                id="sublineList">
                <option value={null}>
                    {
                        list.length === 0
                            ? "Нет доступных зон"
                            : "Выбрать зону"
                    }
                </option>
                {
                    list.map((sub) => (
                        <option
                            key={sub.title}
                            value={sub.id}>
                            {
                                `${sub.title} (ID:${sub.id})`
                            }
                        </option>
                    ))
                }
            </Input>
        </FormGroup>
    );

    render() {
        const { sublineList, submitInfo } = this.state;
        const { selectedSublineMarkers, setPanProp } = this.props;
        const checkShow = selectedSublineMarkers.length === 0 ? "sublines-content_hide" : "sublines-content_show";
        return (
            <div className={`sublines-content-view ${checkShow}`}>
                <button
                    className="sublines-content-view__clean-btn"
                    onClick={() => setPanProp("selectedSublineMarkers", [])}
                    type="button">
                    Очистить всё
                </button>
                <div className="sublines-content-view__list-wrapper">
                    {
                        this.renderList(selectedSublineMarkers)
                    }
                </div>
                <div>
                    {
                        this.renderSublineSelect(sublineList)
                    }
                    <button
                        style={{ float: "right" }}
                        onClick={this.submitContentSubline}
                        type="button">
                        Подтвердить
                    </button>
                </div>
                {
                    submitInfo && (
                        <div className={`sublines-content-view__info ${submitInfo.success ? "subline-content-success" : "subline-content-fail"}`}>
                            {submitInfo.title}
                        </div>
                    )
                }
            </div>
        );
    }
}

export default SublinesContentView;
