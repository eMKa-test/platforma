import React from "react";
import * as PropTypes from "prop-types";
import { Form, FormGroup, Input } from "reactstrap";
import Button from "../Buttons/Button";
import { CONTENT_CATEGORY } from "../../constants";
import EventItems from "./EventItems";
import addEventIcon from "../../assets/addEvent.png";

const contentEvent = CONTENT_CATEGORY().filter((el, i) => i < 3);

class EventBlock extends React.Component {
    state = {
        eventName: "",
        massContent: 0,
        massProgress: 0,
        clearAllEvents: false,
        eventBlockShow: false,
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.massContent !== this.state.massContent && this.state.massContent > 0 && this.state.eventName) {
            this.props.takeCheckUploadEventBlock(true);
        }
        if (prevProps.checkUploadEventBlock !== this.props.checkUploadEventBlock && !this.props.checkUploadEventBlock) {
            if (this.state.eventName) {
                this.clearEventBlock(false);
                this.props.checkDropMode();
            } else {
                this.clearEventBlock();
                this.props.checkDropMode();
            }
        }
        if (prevProps.uploadRun !== this.props.uploadRun && !this.props.uploadRun && !this.props.uploadEventBlock && this.state.massProgress > 0) {
            this.clearEventBlock();
        }
        if (prevState.eventBlockShow !== this.state.eventBlockShow && !this.state.eventBlockShow) {
            this.clearEventBlock();
            this.props.checkDropMode();
        }
    }

    setNewEventName = (e) => {
        const { massContent } = this.state;
        const name = e.target.value;
        this.setState({ eventName: name });
        if (name.length === 0 && massContent === 0) {
            this.props.takeCheckUploadEventBlock(false);
            this.props.checkDropMode();
            return null;
        }
        if (name.length > 0 && massContent === 0) {
            this.props.takeCheckUploadEventBlock(false);
            return null;
        }
        this.props.takeCheckUploadEventBlock(true);
        this.props.checkDropMode();
    }

    setCountContent = (val) => this.setState((state) => ({ massContent: state.massContent + val }));

    countMassProgress = (val) => this.setState((state) => ({ massProgress: state.massProgress + val }));

    setClearAllEvents = (val) => this.setState(({ clearAllEvents: val }));

    clearEventBlock = (except = true) => {
        if (except) {
            this.setState({
                eventName: "",
                massContent: 0,
                massProgress: 0,
                clearAllEvents: true,
            });
            return null;
        }
        this.setState({
            massContent: 0,
            massProgress: 0,
            clearAllEvents: true,
        });
        return null;
    }

    openEventBlock = () => {
        this.setState((state) => ({ eventBlockShow: !state.eventBlockShow }), this.clearEventBlock);
    }

    checkEventName = () => {
        if (!this.state.eventName && this.state.massContent > 0) {
            this.props.takeCheckUploadEventBlock(false);
            alert("Не заполнено имя события.");
        }
    }

    render() {
        const {
            eventName, eventBlockShow,
        } = this.state;
        const { uploadRun } = this.props;
        return (
            <div
                className="agent-line-container agent_event-block">
                <div>
                    <Button
                        classes="agent-event_show-button col-2 btn_with_icon"
                        styles="eventblock"
                        disMode={uploadRun ? true : false}
                        handleFunc={this.openEventBlock}>
                        {eventBlockShow ? "Скрыть форму" : "Добавить событие"}
                        <img
                            className="agent_btn_icons"
                            src={addEventIcon}
                            alt="Add icon" />
                    </Button>
                    <div className={`agent_event-body-event-box ${eventBlockShow ? "show_event-block" : "hide_event-block"}`}>
                        <Form
                            onSubmit={(e) => { e.preventDefault(); }}
                            className="event-name_form">
                            <FormGroup>
                                <Input
                                    onBlur={this.checkEventName}
                                    onChange={this.setNewEventName}
                                    type="text"
                                    name="event"
                                    value={eventName}
                                    placeholder="Наименование события" />
                            </FormGroup>
                        </Form>
                        <div className="agent_event-upload_items">
                            {
                                contentEvent.map((elem, i) => (
                                    <div
                                        key={`${i}_event`}
                                        className="body-event_item col-3">
                                        <EventItems
                                            {...this.props}
                                            {...this.state}
                                            clearEventBlock={this.clearEventBlock}
                                            setClearAllEvents={this.setClearAllEvents}
                                            countMassProgress={this.countMassProgress}
                                            setCountContent={this.setCountContent}
                                            type={elem.type}
                                            accept={elem.accept}
                                            nameItem={elem.name} />
                                    </div>))
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

EventBlock.propTypes = {
    uploadRun: PropTypes.bool.isRequired,
    dropMode: PropTypes.bool.isRequired,
    changeBGHeader: PropTypes.func,
    handleCollects: PropTypes.func,
};

export default EventBlock;
