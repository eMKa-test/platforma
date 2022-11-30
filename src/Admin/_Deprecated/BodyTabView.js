import React from "react";
import * as PropTypes from "prop-types";
import { Button, ButtonGroup } from "reactstrap";
import GPSCorrect from "src/Admin/components/LMaps";
import PanoramaCorrect from "src/Admin/components/PanoramCorrect";
import SublinesCorrect from "src/Admin/components/SublinesCorrect";
import AeroCreatePanorama from "src/Admin/components/AeroCreatePanorama";
import AngleMod from "../views/Lines/Panorama/AngleMod";

class BodyTabView extends React.Component {
    static propTypes = {
        switchPanel: PropTypes.string.isRequired,
        activeTab: PropTypes.string.isRequired,
        changeSwitchPanel: PropTypes.func.isRequired,
        setPanoramEditMode: PropTypes.func.isRequired,
        submitAngel: PropTypes.func.isRequired,
        cancelAngle: PropTypes.func.isRequired,
        currentLine: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    renderSelector = (switchPanel) => (
        <ButtonGroup className="mb-2">
            <Button
                color="primary"
                outline
                onClick={() => this.props.changeSwitchPanel("map")}
                active={switchPanel === "map"}>
                Коррекция GPS
            </Button>
            <Button
                color="primary"
                outline
                onClick={() => this.props.changeSwitchPanel("panorama")}
                active={switchPanel === "panorama"}>
                Коррекция панорам
            </Button>
            <Button
                color="primary"
                outline
                onClick={() => this.props.changeSwitchPanel("sublines")}
                active={switchPanel === "sublines"}>
                Коррекция зон
            </Button>
        </ButtonGroup>
    );

    switcherPanoramTab = (switchPanel) => {
        switch (switchPanel) {
            case "map":
                return (
                    <GPSCorrect
                        {...this.props}
                        objectId={this.props.currentLine.projectId}
                        lineId={this.props.currentLine.id} />
                );
            case "panorama":
                return (
                    <PanoramaCorrect
                        {...this.props}
                        params={this.props.currentLine} />
                );
            case "sublines":
                return (
                    <SublinesCorrect
                        {...this.props}
                        objectId={this.props.currentLine.projectId}
                        lineId={this.props.currentLine.id} />
                );
            default: return null;
        }
    };

    render() {
        const {
            activeTab,
            currentLine,
            cancelAngle,
            submitAngel,
            setPanoramEditMode,
            switchPanel,
        } = this.props;
        if (currentLine.id < 0) {
            return null;
        }
        switch (activeTab) {
            case "panorama":
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
                                            {...this.props}
                                            onCancel={cancelAngle}
                                            onSubmit={submitAngel}
                                            initEditMode={setPanoramEditMode} />
                                    </div>
                                ) : null
                            }
                        </div>
                        {
                            this.switcherPanoramTab(switchPanel)
                        }
                    </React.Fragment>
                );
            case "aeropanorama":
                return (
                    <AeroCreatePanorama
                        {...this.props}
                        params={currentLine} />
                );
            default:
                return (
                    <GPSCorrect
                        {...this.props}
                        objectId={currentLine.projectId}
                        lineId={currentLine.id} />
                );
        }
    }
}

export default BodyTabView;
