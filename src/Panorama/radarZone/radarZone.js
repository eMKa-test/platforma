import React, { useState, useEffect } from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import uniqueId from "lodash/uniqueId";
import classNames from "classnames";
import ContentItem from "./contentItems";
import compassIcon from "../../Desktop/assets/icons/compass.svg";
import rightMedias from "../../Desktop/assets/icons/rightMedias.svg";
import leftMedias from "../../Desktop/assets/icons/leftMedias.svg";
import styles from "./styles";

function changeViewToContent(view, { yaw }, scene) {
    scene.lookTo({ yaw, pitch: 0 }, {
        transitionDuration: 500,
    });
}

const RadarZone = ({
    modalContent, classes, view, scene,
    openModalFromRadar, setNorthPosition,
    yaw, index,
}) => {
    const [currentPanIndex, setNewPanIndex] = useState(null);
    const [rightContent, checkRightContent] = useState([]);
    const [leftContent, checkLeftContent] = useState([]);

    function setContent(arr, side) {
        let result;
        if (side === "leftContent") {
            result = leftContent.find((el) => arr.index === el.index);
            if (!result) {
                const count = leftContent;
                count.push(arr);
                checkLeftContent(count);
            }
            return null;
        } else {
            result = rightContent.find((el) => arr.index === el.index);
            if (!result) {
                const count = rightContent;
                count.push(arr);
                checkRightContent(count);
            }
            return null;
        }
    }

    function sortContent(arr, side, sideMass) {
        const sorting = side.reduce((acc, cur) => cur.index !== arr.index
            ? [...acc, cur]
            : acc, []);
        if (sideMass === "left") {
            setContent(arr, "rightContent");
            checkLeftContent(sorting);
            return null;
        }
        checkRightContent(sorting);
        setContent(arr, "leftContent");
        return null;
    }

    function resetSidesOnView(item, side, sideMass) {
        const sorting = side.reduce((acc, cur) => cur.index !== item.index
            ? [...acc, cur]
            : acc, []);
        if (sideMass === "left") {
            checkLeftContent(sorting);
            return null;
        }
        checkRightContent(sorting);
        return null;
    }

    function checkIndexPan(val) {
        setNewPanIndex(val);
        checkRightContent([]);
        checkLeftContent([]);
    }

    useEffect(() => {
        if (currentPanIndex !== index) {
            checkIndexPan(index);
        }
    });

    return (
        <div className={classes.wrapperRadarZone}>
            <div className={classes.northWrapper}>
                <img
                    className={classes.northIndicate}
                    style={{ transform: `rotate(${setNorthPosition(yaw)}deg)` }}
                    src={compassIcon}
                    alt="north icon" />
            </div>
            <div
                className={classNames(
                    classes.leftSortContent,
                    {
                        [classes.showLeftIndicate]: leftContent.length > 0,
                        [classes.hideLeftIndicate]: leftContent.length === 0,
                    },
                )}>
                <button
                    type="button"
                    onClick={() => changeViewToContent(view, leftContent[0], scene)}>
                    <img
                        src={leftMedias}
                        alt="medias" />
                    {
                        leftContent.length > 0 && (
                            <span>
                                {leftContent.length}
                            </span>)
                    }
                </button>
            </div>
            <div
                className={classNames(
                    classes.rightSortContent,
                    {
                        [classes.showRightIndicate]: rightContent.length > 0,
                        [classes.hideRightIndicate]: rightContent.length === 0,
                    },
                )}>
                <button
                    type="button"
                    onClick={() => changeViewToContent(view, rightContent[rightContent.length - 1], scene)}>
                    <img
                        src={rightMedias}
                        alt="medias" />
                    {
                        rightContent.length > 0 && (
                            <span>
                                {rightContent.length}
                            </span>)
                    }
                </button>
            </div>
            <div className={classes.lineWithContent}>
                {
                    modalContent.map((img, i) => (
                        <ContentItem
                            key={uniqueId(`radar_content-item_${i}`)}
                            img={img}
                            yaw={yaw}
                            view={view}
                            openModalFromRadar={openModalFromRadar}
                            setContent={setContent}
                            leftContent={leftContent}
                            rightContent={rightContent}
                            sortContent={sortContent}
                            resetSidesOnView={resetSidesOnView}
                        />
                    ))
                }
            </div>
        </div>
    );
};

RadarZone.propTypes = {
    modalContent: PropTypes.arrayOf(PropTypes.object).isRequired,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    view: PropTypes.object.isRequired,
    scene: PropTypes.object.isRequired,
    openModalFromRadar: PropTypes.func.isRequired,
    setNorthPosition: PropTypes.func.isRequired,
    yaw: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
};

export default withStyles(styles)(RadarZone);
