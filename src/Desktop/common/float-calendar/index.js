import React from "react";
import uniqueId from "lodash/uniqueId";
import * as PropTypes from "prop-types";
import classNames from "classnames";

import "./style.css";
import List from "./list";

function FloatCalendar(props) {
    const { onSelect, content } = props;
    const [show, toggle] = React.useState(false);
    const [selected, setSelected] = React.useState(null);

    const id = uniqueId("float-calendar-");

    function onToggle(ev) {
        ev.stopPropagation();
        toggle(!show);
    }

    function onBlur({ target }) {
        // для закрытие списка при клике вне зоны взаимодействия
        if (id !== target.id) {
            toggle(false);
        }
    }

    function handleSelect(date) {
        setSelected(date ? date.format("MMM YYYY") : null);
        onSelect(date);
    }

    React.useEffect(() => {
        window.addEventListener("click", onBlur);
        return function cleanup() {
            window.removeEventListener("click", onBlur);
        };
    });

    return (
        <div className="float-calendar">
            <button
                type="button"
                onClick={onToggle}
                className="float-calendar__toggler">
                <span className="icon-fontello-3-calendar" />
            </button>
            <span className="float-calendar__selected">{selected}</span>
            {selected ? (
                <button
                    type="button"
                    className="float-calendar__reset"
                    onClick={() => handleSelect(null)}>
                    &times;
                </button>
            ) : null}
            <List
                id={id}
                show={show}
                content={content}
                onSelect={handleSelect} />
        </div>
    );
}

FloatCalendar.propTypes = {
    onSelect: PropTypes.func,
    content: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string,
    })),
};

export default React.memo(FloatCalendar);
