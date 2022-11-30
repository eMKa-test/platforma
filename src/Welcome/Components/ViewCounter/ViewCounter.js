import React, { Component } from "react";

class ViewCounter extends Component {
    renderToggler = (i, active) => {
        return (
            <div
                key={i}
                className={`ViewCounter-viewToggler ${active && "active"}`}
                onClick={() => this.props.toggleView(i)}
            />
        );
    };

    renderViewTogglers = (viewIndex, viewsCount) => {
        const togglers = [];
        for (let i = 0; i < viewsCount; i++) {
            const toggler = this.renderToggler(i, i === viewIndex);
            togglers.push(toggler);
        }
        return togglers;
    };

    styleHeight = height => ({ height: `${height*0.7}rem` });

    render() {
        const { viewIndex, viewsCount, dir = "DOWN", height = 0 } = this.props;
        return (
            <div className="ViewCounter">
                {dir === "UP" &&
                    height > 0 && (
                        <div className="ViewCounter-chevronWrapper">
                            <div className="ViewCounter-chevron ViewCounter-chevron_up" style={this.styleHeight(height)} />
                        </div>
                    )}
                <div className="ViewCounter-viewIndex">0{viewIndex + 1}</div>
                {this.renderViewTogglers(viewIndex, viewsCount)}
                {dir === "DOWN" &&
                    height > 0 && (
                        <div className="ViewCounter-chevronWrapper">
                            <div
                                className="ViewCounter-chevron ViewCounter-chevron_down"
                                style={this.styleHeight(height)}
                            />
                        </div>
                    )}
            </div>
        );
    }
}

export default ViewCounter;
