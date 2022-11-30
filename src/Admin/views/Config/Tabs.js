import React from "react";
import * as PropTypes from "prop-types";
import classnames from "classnames";
import { Button } from "reactstrap";
import { LINES_WITH_CAMS } from "../../../constants";

const availableTabs = {
    AERIAL: "Аэросьемка",
    TIMELAPSE: "Таймлапс",
    PANORAMA: "Просмотр",
    IMAGE: "Фото",
    VIDEO: "Видео",
    CAMERAS: "Камеры",
    AEROPANORAMA: "Аэро",
    MODEL: "3D",
};

const classes = [
    "rounded-0",
    "border-white",
];

const style = {
    flex: 1,
};

function TabsConfig({ onClick, tabs, lineID }) {
    return (
        <div className="d-flex flex-wrap justify-content-between align-items-stretch">
            {Object.entries(availableTabs).map(([key, val]) => {
                const active = tabs.includes(key);
                if (key === "CAMERAS" && LINES_WITH_CAMS.includes(String(lineID))) {
                    return (
                        <Button
                            key={String(key)}
                            className={classnames(classes)}
                            color={`${active ? "primary" : "light"}`}
                            style={style}
                            onClick={onClick(key, tabs)}>
                            {val}
                        </Button>
                    );
                } else if (key !== "CAMERAS") {
                    return (
                        <Button
                            key={String(key)}
                            className={classnames(classes)}
                            color={`${active ? "primary" : "light"}`}
                            style={style}
                            onClick={onClick(key, tabs)}>
                            {val}
                        </Button>
                    );
                } else {
                    return null;
                }
            })}
        </div>
    );
}

TabsConfig.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
    onClick: PropTypes.func.isRequired,
    lineID: PropTypes.number.isRequired,
};

export default React.memo(TabsConfig);
