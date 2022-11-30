import React from "react";
import * as PropTypes from "prop-types";
import cloneDeep from "lodash/cloneDeep";
import "./style.css";
import ControlPanel from "./controlPanel";
import { initialPolygon, getTypeUnit } from "./controlPanel/optionProperties";
import { ruleOfAddmetaPolygon } from "./helper";

class PolygonRender extends React.Component {
    static propTypes = {
        scene: PropTypes.object.isRequired,
        view: PropTypes.object.isRequired,
        addZonePolygon: PropTypes.bool.isRequired,
        removePolygon: PropTypes.func.isRequired,
        getSublineList: PropTypes.func.isRequired,
        currentPanorama: PropTypes.object.isRequired,
        onScenePolygons: PropTypes.array,
        editPolygon: PropTypes.object,
        changeAeroSceneData: PropTypes.func.isRequired,
    };

    constructor() {
        super();
        this.state = {
            editMode: false,
            polygon: null,
            sublineList: [],
            selectedSubline: null,
        };
    }

    updateSpot = () => this.deleteSpot(this.createPolygon);

    deleteSpot = (callback) => {
        const spots = this.props.scene.hotspotContainer().listHotspots();
        spots.forEach((spot) => {
            if (spot.domElement().classList.contains("demo-polygon")) {
                this.props.scene.hotspotContainer().destroyHotspot(spot);
            }
        });
        if (callback && typeof callback === "function") {
            callback();
        }
    };

    componentDidUpdate(prevProps) {
        if (prevProps.addZonePolygon !== this.props.addZonePolygon && this.props.addZonePolygon) {
            this.addPolygon();
        }
        if (this.props.scene !== prevProps.scene && this.state.polygon) {
            this.removePolygon();
        }
        if (this.props.editPolygon && this.state.polygon !== this.props.editPolygon && !this.state.polygon) {
            this.startEditPolygon(this.props.editPolygon);
        }
    }

    startEditPolygon = (polygon) => {
        this.setState({
            selectedSubline: polygon, polygon: cloneDeep(polygon.params), editMode: true,
        }, this.createPolygon);
    };

    createPolygon = () => {
        const { polygon } = this.state;
        const container = document.createElement("div");
        const info = document.createElement("div");
        info.classList.add("demo-polygon-description");
        info.innerText = polygon.title;
        container.appendChild(info);
        container.classList.add("demo-polygon");

        container.style.width = polygon.size.width;
        container.style.height = polygon.size.height;

        let transformString = "";
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, val] of Object.entries({ ...polygon.translate, ...polygon.rotation })) {
            transformString += `${key}(${val})`;
        }
        this.props.scene.hotspotContainer()
            .createHotspot(
                container,
                { ...polygon.coord },
                {
                    perspective: {
                        radius: polygon.radius.radius,
                        extraTransforms: transformString,
                    },
                },
            );
    };

    submitPolygon = () => {
        const { selectedSubline, polygon } = this.state;
        if (!selectedSubline && !this.props.editPolygon) {
            alert("Не выбрана привязываемая зона");
            return null;
        }
        const { currentPanorama } = this.props;
        const { id, meta: subMeta, gps } = selectedSubline;
        let body = { ...currentPanorama };
        let meta;
        if (body.meta) {
            try {
                meta = JSON.parse(body.meta);
                const newMeta = ruleOfAddmetaPolygon(meta, id, polygon.title, subMeta, gps, polygon);
                body = {
                    ...body,
                    meta: newMeta,
                };
                this.props.changeAeroSceneData(body);
            } catch (e) {
                console.error("Error Parse JSON", e);
            }
        }
    };

    onCahngeParams = (name, type) => (e) => {
        const polygon = { ...this.state.polygon };
        if (type && e) {
            const { value } = e.target;
            polygon[name][type] = getTypeUnit(name, +value);
        } else {
            polygon.title = name;
        }
        this.setState({ polygon }, this.updateSpot);
    };

    onSelect = ({ target: { value } }) => {
        if (value) {
            const selectedSubline = this.state.sublineList.find((sub) => sub.id === +value);
            this.setState({ selectedSubline });
            this.onCahngeParams(selectedSubline.title)();
        } else {
            this.setState({ polygon: cloneDeep(initialPolygon), selectedSubline: null });
            this.onCahngeParams(initialPolygon.title)();
        }
    };

    addPolygon = () => {
        if (this.state.editMode) {
            return null;
        }
        this.props.getSublineList().then((list) => {
            const pids = this.props.onScenePolygons.map(({ id }) => id);
            const sublineList = list.filter((pol) => !pids.includes(pol.id));
            const polygon = cloneDeep(initialPolygon);
            polygon.coord.yaw = this.props.view.yaw();
            this.setState({
                editMode: true, polygon, sublineList,
            }, this.createPolygon);
        });
    };

    removePolygon = () => {
        if (!this.state.editMode) {
            return null;
        }
        this.setState({
            editMode: false, polygon: null, sublineList: [], selectedSubline: null,
        }, this.deleteSpot);
        this.props.removePolygon();
    };

    render() {
        return (
            <ControlPanel
                editPolygon={this.props.editPolygon}
                selectedSubline={this.state.selectedSubline}
                onSelect={this.onSelect}
                sublineList={this.state.sublineList}
                editMode={this.state.editMode}
                addPolygon={this.addPolygon}
                removePolygon={this.removePolygon}
                submitPolygon={this.submitPolygon}
                submitEditPolygon={this.submitEditPolygon}
                object={this.state.polygon}
                onChange={this.onCahngeParams} />
        );
    }
}

export default PolygonRender;
