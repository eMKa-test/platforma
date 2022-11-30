import React from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ToggleButton from "@material-ui/lab/ToggleButton";
import MapIcon from "@material-ui/icons/Place";
import ThreeDRotationIcon from "@material-ui/icons/ThreeDRotation";
import CalendarIcon from "@material-ui/icons/DateRange";
import styles from "./styles";
import convertDate from "./helpers";
import CloseButton from "../../common/buttons/close";
import { ACCESS_ROUTE_TABS_FOR_MAP, CALENDAR_TABS_ACCESS, MODEL_LINES_ACCESS } from "../../../constants";

class ToggleBtns extends React.Component {
    static propTypes = {
        showMap: PropTypes.func.isRequired,
        showCalendar: PropTypes.func.isRequired,
        showModel: PropTypes.func.isRequired,
        params: PropTypes.object.isRequired,
        classes: PropTypes.object.isRequired,
        modeCalendar: PropTypes.bool.isRequired,
        modeMap: PropTypes.bool.isRequired,
        modeModel: PropTypes.bool.isRequired,
        sublineMode: PropTypes.bool.isRequired,
        setSublineMode: PropTypes.func.isRequired,
        date: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillUnmount() {
        this.props.showMap(false);
        this.props.showCalendar(false);
        this.props.showModel(false);
    }

    // eslint-disable-next-line consistent-return
    componentDidUpdate(prevProps) {
        const {
            showMap, showCalendar, params, showModel,
        } = this.props;
        if (prevProps.params.tab !== params.tab || prevProps.params.lineID !== params.lineID) {
            showMap(false);
            showCalendar(false);
            showModel(false);
        }
    }

    checkDisabledMode = (btnName) => {
        const { params: { tab }, sublineMode } = this.props;
        switch (btnName) {
            case "map":
                return !ACCESS_ROUTE_TABS_FOR_MAP.includes(tab);
            case "calendar":
                return !CALENDAR_TABS_ACCESS.includes(tab) || sublineMode;
            default:
                return true;
        }
    };

    onChangeMode = (mode) => () => {
        const {
            showMap, modeMap,
            showCalendar, modeCalendar,
            showModel, modeModel,
        } = this.props;
        const scope = this;
        switch (mode) {
            case "model": return (function loadModel() {
                const { cacheModel, runLoadModel, params: { lineID } } = scope.props;
                if (!cacheModel[lineID]) {
                    runLoadModel(true);
                    return showModel(!modeModel);
                }
                return showModel(!modeModel);
            }());
            case "map":
                return showMap(!modeMap);
            case "calendar":
                return showCalendar(!modeCalendar);
            default:
                return null;
        }
    };

    modelBtnCheckDisable = (sublineMode, lineID) => {
        return sublineMode || !MODEL_LINES_ACCESS.includes(lineID);
    };

    render() {
        const {
            classes, params, date, sublineMode, setSublineMode,
            modeMap, modeCalendar, modeModel,
        } = this.props;
        return (
            <div className={classes.headerToggleContainer}>
                {
                    params.tab !== "cameras" && date && (
                        <span className={classes.headerDate}>
                            {convertDate(date)}
                        </span>
                    )
                }
                <ToggleButton
                    onChange={this.onChangeMode("calendar")}
                    disabled={this.checkDisabledMode("calendar")}
                    className={classes.toggleBtn}
                    selected={modeCalendar}
                    value="calendar">
                    <CalendarIcon />
                </ToggleButton>
                <ToggleButton
                    onChange={this.onChangeMode("model")}
                    disabled={this.modelBtnCheckDisable(sublineMode, params.lineID)}
                    className={classes.toggleBtn}
                    selected={modeModel}
                    value="model">
                    <ThreeDRotationIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton
                    onChange={this.onChangeMode("map")}
                    disabled={this.checkDisabledMode("map")}
                    className={classes.toggleBtn}
                    selected={modeMap}
                    value="map">
                    <MapIcon />
                </ToggleButton>
                {
                    sublineMode && (
                        <CloseButton
                            extendClassBtn={classes.closeSublineBtn}
                            extendClassVal={classes.closeSublineBtnValue}
                            onClick={() => setSublineMode(false)} />
                    )
                }
            </div>
        );
    }
}

export default withStyles(styles)(ToggleBtns);
