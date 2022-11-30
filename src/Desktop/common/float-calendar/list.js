import React from "react";
import * as PropTypes from "prop-types";
import RSC from "react-scrollbars-custom";
import isEmpty from "lodash/isEmpty";
import memoize from "lodash/memoize";
import classNames from "classnames";

const defaultList = memoize(() => {
    const min = moment().startOf("month");
    const max = moment().endOf("month");
    const arr = [];
    for (
        const date = moment(max);
        date.isAfter(moment(min).subtract(1, "month"));
        date.subtract(1, "month")
    ) {
        const d = moment(date);
        arr.push(d);
    }
    return arr;
});

function generateList(content) {
    if (!isEmpty(content)) {
        const set = new Set();
        for (let i = 0; i < content.length; i += 1) {
            const d = moment(content[i].date).startOf("month");
            set.add(d.format());
        }
        return Array.from(set);
    }
    return defaultList();
}

const List = (props) => {
    const {
        onSelect, content, id, show,
    } = props;
    const list = generateList(content);
    return (
        <div
            id={id}
            className={
                classNames("float-calendar__list-wrapper", {
                    "float-calendar__list-wrapper_active": show,
                })
            }
            style={{
                height: list.length * 40,
            }}>
            <RSC
                trackYProps={{ className: "trackY" }}
                thumbYProps={{ className: "thumbY" }}>
                <ul className="float-calendar__list">
                    {list.map((dateStr) => {
                        const d = moment(dateStr);
                        return (
                            <li
                                key={dateStr}
                                className="float-calendar__list-item">
                                <button
                                    className="float-calendar__list-button"
                                    type="button"
                                    aria-label="Выберите месяц"
                                    onClick={() => onSelect(d)}>
                                    {d.format("MMM YYYY")}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </RSC>
        </div>
    );
};

List.propTypes = {
    onSelect: PropTypes.func.isRequired,
    content: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string,
    })),
    id: PropTypes.string,
    show: PropTypes.bool,
};

export default List;
