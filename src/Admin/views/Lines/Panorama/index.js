import React from "react";
import * as PropTypes from "prop-types";
import axios from "axios";
import { Button, ButtonGroup } from "reactstrap";
import isEqual from "lodash/isEqual";
import PanoramaTab from "./PanoramaTab";
import GPSCorrect from "../../../components/LMaps/LMaps";
import PanoramaCorrect from "../../../components/PanoramCorrect";
import SublinesCorrect from "../../../components/SublinesCorrect";
import AngleMod from "./AngleMod";
import { toRoundNum } from "../../../components/PanoramCorrect/helpers";

class Panorama extends React.Component {
    static propTypes = {
        currentLine: PropTypes.object.isRequired,
        tabLoader: PropTypes.object.isRequired,
        content: PropTypes.array.isRequired,
        changeEditGroupsMark: PropTypes.func.isRequired,
        resetFromSwitchPanel: PropTypes.func.isRequired,
        dateFrom: PropTypes.string,
        objectID: PropTypes.string,
        lineID: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            switchPanel: "sublines",
            correctAngel: 0,
            baseAngel: 0,
            startEdit: 0,
            contentAngle: 0,
            panoramEditMode: false,
            currentContentEdit: null,
            currentPanoramEdit: null,
            content: [],
            id: null,
            selectedSublineMarkers: [],
        };
    }

    componentDidMount() {
        this.setState({ content: this.props.content });
    }

    componentDidUpdate() {
        if (!isEqual(this.state.content, this.props.content)) {
            this.setState({ content: this.props.content });
        }
    }

    changeSwitchPanel = (val) => {
        if (val === "panorama" && this.state.switchPanel === "panorama") {
            return null;
        }
        this.props.changeEditGroupsMark([]);
        this.setState({
            switchPanel: val,
            id: null,
            currentContentEdit: null,
            currentPanoramEdit: null,
        }, this.cancelAngle);
        this.props.resetFromSwitchPanel();
    };

    renderSelector = (switchPanel) => (
        <ButtonGroup className="mb-2">
            <Button
                color="primary"
                outline
                onClick={() => this.changeSwitchPanel("sublines")}
                active={switchPanel === "sublines"}>
                Привязка панорам к зонам
            </Button>
            <Button
                color="primary"
                outline
                onClick={() => this.changeSwitchPanel("panorama")}
                active={switchPanel === "panorama"}>
                Коррекция панорам
            </Button>
            <Button
                color="primary"
                outline
                onClick={() => this.changeSwitchPanel("map")}
                active={switchPanel === "map"}>
                Коррекция GPS панорам
            </Button>
        </ButtonGroup>
    );

    switcherPanoramTab = (switchPanel, content) => {
        if (this.props.dateFrom) {
            switch (switchPanel) {
                case "sublines":
                    return (
                        <SublinesCorrect
                            {...this.props}
                            {...this.state}
                            setPanProp={this.setPanProp}
                            objectId={this.props.currentLine.projectId}
                            lineId={this.props.currentLine.id} />
                    );
                case "map":
                    return (
                        <GPSCorrect
                            {...this.props}
                            content={content}
                            objectId={this.props.currentLine.projectId}
                            lineId={this.props.currentLine.id} />
                    );
                case "panorama":
                    return (
                        <PanoramaCorrect
                            {...this.props}
                            {...this.state}
                            setCurrentContentEdit={this.setCurrentContentEdit}
                            cancelAngle={this.cancelAngle}
                            changePanId={this.changePanId}
                            setPanProp={this.setPanProp}
                            params={this.props.currentLine} />
                    );
                default: return null;
            }
        }
        return <div style={{ height: "600px" }} />;
    };

    submitAngle = () => {
        const { currentPanoramEdit, currentContentEdit } = this.state;
        const { objectID, lineID } = this.props;
        const { correctAngel, baseAngel, contentAngle } = this.state;
        let newAngle = toRoundNum(baseAngel + correctAngel) % 360;
        let magneticAngle = newAngle < 0 ? 360 + newAngle : newAngle;
        let body = {
            ...currentPanoramEdit,
            magneticAngle,
        };
        let url = `/admin/api/projects/${objectID}/lines/${lineID}/content/panorama/${currentPanoramEdit.id}`;
        if (currentContentEdit) {
            newAngle = toRoundNum(contentAngle + correctAngel) % 360;
            magneticAngle = newAngle < 0 ? 360 + newAngle : newAngle;
            body = {
                ...currentContentEdit,
                magneticAngle,
            };
            url = `/admin/api/projects/${objectID}/lines/${lineID}/content/`
                + `${currentContentEdit.type.toLowerCase()}/${currentContentEdit.id}`;
        }
        axios.put(url, body)
            .then(() => {
                this.cancelAngle();
            });
    };

    cancelAngle = () => {
        this.setState({
            currentPanoramEdit: null,
            currentContentEdit: null,
            panoramEditMode: false,
            correctAngel: 0,
            baseAngel: 0,
            startEdit: 0,
            contentAngle: 0,
        });
    };

    setPanProp = (name, val) => {
        this.setState({ [name]: val });
    };

    changePanId = (id) => {
        if (this.state.panoramEditMode) {
            return null;
        }
        this.setState({ id });
    };

    setCurrentContentEdit = (val) => {
        if (!val) {
            const elems = document.querySelectorAll(".preview__container-edit");
            elems.forEach((elem) => {
                if (elem.classList.contains("preview__container-edit")) {
                    elem.classList.remove("preview__container-edit");
                }
            });
            this.setState({ currentContentEdit: val, contentAngle: 0 });
        } else {
            this.setState({ currentContentEdit: val });
        }
    };

    render() {
        const { switchPanel, content } = this.state;
        return (
            <React.Fragment>
                <div className="d-flex justify-content-between">
                    {
                        this.renderSelector(switchPanel)
                    }
                    {
                        switchPanel === "panorama" ? (
                            <div className="button__group-correct-panel">
                                <AngleMod
                                    {...this.state}
                                    {...this.props}
                                    setCurrentContentEdit={this.setCurrentContentEdit}
                                    onCancel={this.cancelAngle}
                                    onSubmit={this.submitAngle}
                                    setPanProp={this.setPanProp} />
                            </div>
                        ) : null
                    }
                </div>
                {
                    this.switcherPanoramTab(switchPanel, content)
                }
                <PanoramaTab
                    changePanId={this.changePanId}
                    pans={content}
                    {...this.props}
                    {...this.state} />
            </React.Fragment>
        );
    }
}

export default Panorama;
