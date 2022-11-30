import React from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import {
    Nav, NavItem, NavLink, TabContent, TabPane, Spinner,
} from "reactstrap";
import { ADMIN_LINES_TABS } from "../../constant";
import BodyTabAside from "./BodyTabAside";
import { getData } from "../../../api";
import { defaultSettings } from "../../layout/DefaultPagination";

class ContentTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "image",
            content: [],
            isOpenPreviwMap: false,
            currentMarkerForEdit: {},
            editMode: false,
            asidePanel: false,
            showMeEditIndex: null,
            showMeEditContent: null,
            forceMapUpdateCoords: false,
            shiftKey: false,
            groups: [],
            showPage: 1,
            limit: 12,
            pagination: { ...defaultSettings },
            total: 0,
            showPreviewPic: false,
            loadingMap: true,
        };
        this.tabLoader = this.tabLoader.bind(this);
    }

    componentDidMount() {
        this.fetchContent();
        document.addEventListener("keydown", this.closeMapPreviw);
        document.addEventListener("keydown", this.showMapPreviw);
    }

    fetchContent = (url = this.state.pagination) => {
        if (!this.props.dateFrom) {
            return null;
        }
        this.setState({
            content: [],
            asidePanel: false,
        }, () => {
            const { dateFrom, uploadUrl } = this.props;
            const mainUrl = `${uploadUrl}${this.state.activeTab}`;
            getData({
                mainUrl,
                params: { ...url, dateFrom },
            }).then(({ payload: content, pagination }) => {
                this.setState({
                    content,
                    pagination,
                    total: pagination.total,
                });
            });
        });
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.dateFrom !== this.props.dateFrom && this.state.activeTab === prevState.activeTab) {
            this.setState({ pagination: { ...defaultSettings } }, this.fetchContent);
        }
        if (prevState.showPage !== this.state.showPage) {
            this.handlePagination(this.state.showPage, this.state.limit);
        }
        if (this.state.showPage !== 1 && prevProps.contentType !== this.props.contentType) {
            this.setState({ showPage: 1 });
        }
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.closeMapPreviw);
        document.removeEventListener("keyup", this.showMapPreviwClose);
        document.removeEventListener("keydown", this.showMapPreviw);
    }

    setLimitPage = (valPage, valLim) => {
        this.setState({ showPage: valPage, limit: valLim });
    };

    showMapPreviwClose = (e) => {
        if (this.state.contentType === "panorama") {
            if (e.key === "Shift") {
                document.addEventListener("keydown", this.showMapPreviw);
                document.removeEventListener("keyup", this.showMapPreviwClose);
                this.setState({ shiftKey: false });
            }
        }
    };

    showMapPreviw = (e) => {
        if (this.state.contentType === "panorama") {
            if (e.key === "Shift") {
                this.setState({ shiftKey: true });
                document.removeEventListener("keydown", this.showMapPreviw);
                document.addEventListener("keyup", this.showMapPreviwClose);
            }
        }
    };

    toggle = (tab) => {
        this.props.setContentType(tab);
        this.props.loaderContent(true, false, null);
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
                groups: [],
                showPage: 1,
                shiftKey: false,
                isOpenPreviwMap: false,
                editMode: false,
                currentMarkerForEdit: {},
                content: [],
                showMeEditIndex: null,
                showMeEditContent: null,
                pagination: { ...defaultSettings },
            }, () => {
                this.props.reloadCalendar(tab);
            });
        }
    };

    resetFromSwitchPanel = () => {
        this.setState({
            currentMarkerForEdit: {},
            showMeEditIndex: null,
            showMeEditContent: null,
        });
    };

    setshowMeEditContent = (id, index, val) => {
        this.setState(
            { showMeEditContent: id, showMeEditIndex: index, editMode: val },
            () => {
                const { limit, showMeEditIndex } = this.state;
                const pageIs = Math.ceil((showMeEditIndex + 1) / limit);
                this.setState({ showPage: pageIs });
            },
        );
    };

    showMePreview = (valOpen, valEdit) => this.setState({ isOpenPreviwMap: valOpen, editMode: valEdit });

    closeMapPreviw = (e) => {
        if (e.key === "Escape") {
            if (this.state.showPreviewPic) {
                this.showMePreviewBox();
                return null;
            }
            this.setState({ isOpenPreviwMap: false, editMode: false, currentMarkerForEdit: {} });
        }
    };

    showMePreviewBox = () => this.setState((state) => ({ showPreviewPic: !state.showPreviewPic }));

    startEditMark = (id, index, marker, correctIndex) => {
        if (this.state.contentType !== "panorama") {
            this.setState(
                (state) => ({ groups: state.groups.concat(marker), currentMarkerForEdit: marker }),
                () => {
                    let subIndex = index;
                    if (correctIndex !== undefined) {
                        subIndex = correctIndex;
                    }
                    this.uniqMarkers(this.state.groups);
                    this.setshowMeEditContent(id, subIndex, true);
                    this.showMePreview(true, true);
                },
            );
            return null;
        }
        this.setState(
            (state) => ({ groups: state.groups.concat(marker), currentMarkerForEdit: marker }),
            () => {
                let subIndex = index;
                if (correctIndex !== undefined) {
                    subIndex = correctIndex;
                }
                this.uniqMarkers(this.state.groups);
                this.setshowMeEditContent(id, subIndex, true);
                this.showMePreview(true, true);
                if (this.state.shiftKey) {
                    this.showMePreviewBox(false);
                }
            },
        );
    };

    changeEditGroupsMark = (val) => this.setState({ groups: val });

    uniqMarkers = (marks) => {
        const newMarker = {};
        const uniqMarkerList = marks.filter((el) => {
            if (newMarker[el.id]) {
                return false;
            }
            newMarker[el.id] = true;
            return true;
        });
        this.setState({ groups: uniqMarkerList });
    };

    changeForceMapUpdate = (val) => this.setState({ forceMapUpdateCoords: val });

    toggleAsidePanel = (asidePanel) => () => {
        this.setState((state) => ({ asidePanel: asidePanel || !state.asidePanel }));
    };


    handlePagination = (page, limit) => {
        this.setLimitPage(page, limit);
        this.setState(() => ({ pagination: { page, limit } }), this.fetchContent);
    };

    tabLoader = () => {
        const scope = this;
        return {
            store: this.state,
            maps(loadingMap) {
                scope.setState({ loadingMap });
            },
        };
    };

    render() {
        const { uploadUrl, loading, ...other } = this.props;
        const { activeTab } = this.state;
        return (
            <div className="mb-3 content-tab-container">
                <Nav tabs>
                    {
                        ADMIN_LINES_TABS.map((tab) => (
                            <NavItem key={tab.to}>
                                <NavLink
                                    className={classNames({ active: activeTab === tab.to })}
                                    onClick={() => this.toggle(tab.to)}>
                                    {tab.name}
                                </NavLink>
                            </NavItem>
                        ))
                    }
                </Nav>
                <TabContent activeTab={activeTab}>
                    {
                        ADMIN_LINES_TABS.map((tab) => (
                            <TabPane
                                key={tab.name}
                                tabId={tab.to}>
                                {uploadUrl && activeTab === tab.to && (
                                    <tab.component
                                        resetFromSwitchPanel={this.resetFromSwitchPanel}
                                        tabLoader={this.tabLoader()}
                                        handlePagination={this.handlePagination}
                                        showMePreviewBox={this.showMePreviewBox}
                                        startEditMark={this.startEditMark}
                                        changeForceMapUpdate={this.changeForceMapUpdate}
                                        setshowMeEditContent={this.setshowMeEditContent}
                                        changeEditGroupsMark={this.changeEditGroupsMark}
                                        uploadUrl={`${uploadUrl}${tab.to}`}
                                        {...other}
                                        {...this.state}>
                                        <React.Fragment>
                                            <BodyTabAside
                                                toggleAsidePanel={this.toggleAsidePanel}
                                                {...this.state}
                                                {...this.props} />
                                            <div
                                                className={`content-tab-loader ${loading && !this.props.dateFrom ? "tab-loader_show" : "tab-loader_hide"}`}>
                                                <Spinner color="primary" />
                                            </div>
                                        </React.Fragment>
                                    </tab.component>
                                )}
                            </TabPane>
                        ))
                    }
                </TabContent>
            </div>
        );
    }
}

ContentTabs.propTypes = {
    reloadCalendar: PropTypes.func,
    changeForceMapUpdate: PropTypes.func,
    uploadUrl: PropTypes.string,
    loaderContent: PropTypes.func,
    setContentType: PropTypes.func,
    dateFrom: PropTypes.any,
    loading: PropTypes.bool,
    contentType: PropTypes.string.isRequired,
};

export default ContentTabs;
