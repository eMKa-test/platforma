import React, { Component } from "react";
import * as PropTypes from "prop-types";

import ConfigCard from "./Card";
import TabsConfig from "./Tabs";
import { ROUTES_TABS } from "../../../constants";

class Config extends Component {
    static propTypes = {
        getObjects: PropTypes.func.isRequired,
        clearMemory: PropTypes.func.isRequired,
        putLine: PropTypes.func.isRequired,
        objects: PropTypes.arrayOf(PropTypes.shape({

        })).isRequired,
    };

    state = {
    };

    componentDidMount() {
        this.props.getObjects();
    }

    componentWillUnmount() {
        this.props.clearMemory();
    }

    update = (objectID, lineID, body) => {
        this.props.putLine({
            objectID,
            line: {
                id: lineID,
                ...body,
            },
        });
    }

    handleActive = (objectID, lineID) => ({ target: { checked } }) => {
        this.update(objectID, lineID, { status: checked ? "ACTIVE" : "HIDDEN" });
    }

    handleClickTab = (objectID, lineID) => (key, tabs) => async () => {
        const tabsSet = new Set(tabs);
        if (tabsSet.has(key)) {
            tabsSet.delete(key);
        } else {
            tabsSet.add(key);
        }
        const hardTabs = ROUTES_TABS.filter((tab) => Array.from(tabsSet).includes(tab.to.toUpperCase())).map((finalTAbs) => finalTAbs.to.toUpperCase());
        this.update(objectID, lineID, { tabs: hardTabs });
    }

    render() {
        const { objects } = this.props;
        if (Array.isArray(objects)) {
            return objects.map((object) => (
                <div
                    key={String(object.id)}
                    className="mb-3 border-bottom">
                    <h4 className="mb-3">{object.name}</h4>
                    <div className="row">
                        {Array.isArray(object.lines) && object.lines.map((line) => {
                            const checkboxID = `lineID_${line.id}`;
                            const active = (line.status === "ACTIVE");
                            return (
                                <div
                                    className="col-sm-6 col-lg-4 col-xl-3"
                                    key={String(line.id)}>
                                    <ConfigCard data={line}>
                                        <React.Fragment>
                                            <TabsConfig
                                                lineID={line.id}
                                                onClick={this.handleClickTab(object.id, line.id)}
                                                tabs={line.tabs} />
                                            <div className="mt-1 p-1 border-top">
                                                <div className="custom-control custom-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={active}
                                                        onChange={this.handleActive(object.id, line.id)}
                                                        className="custom-control-input"
                                                        id={checkboxID} />
                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor={checkboxID}>
                                                        Доступно для пользователей
                                                    </label>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    </ConfigCard>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ));
        }
        return null;
        // const {} = this.state;
        // console.log({ objects: this.props.objects });
    }
}

export default Config;
