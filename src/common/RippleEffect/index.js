import React, { Component } from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import "./ripple.css";
import styles from "./styles";

class RippleEffect extends Component {
    parent = React.createRef();

    componentDidMount() {
        this.parent.current.addEventListener("mousedown", this.createCircle);
    }

    componentWillUnmount() {
        this.parent.current.removeEventListener("mousedown", this.createCircle);
    }

    createCircle = (event) => {
        const circle = document.createElement("span");
        const x = event.layerX;
        const y = event.layerY;
        circle.classList.add("circle");
        circle.style.left = `${x - 130}px`;
        circle.style.top = `${y - 130}px`;
        this.parent.current.appendChild(circle);
        setTimeout(() => { this.parent.current.removeChild(circle); }, 1000);
    };

    render() {
        const { classes, children, isActive } = this.props;
        return (
            <div
                ref={this.parent}
                className={classNames(
                    classes.parent,
                    (isActive) ? classes.parentActive : null,
                )}>
                {children}
            </div>
        );
    }
}

RippleEffect.propTypes = {
    classes: PropTypes.object,
    children: PropTypes.object,
    isActive: PropTypes.bool,
};

export default withStyles(styles)(RippleEffect);
