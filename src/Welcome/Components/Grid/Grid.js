import React, { Component } from "react";

class Grid extends Component {
    render() {
        const { right = false, image = "", icon = "", title = "", text = "" } = this.props;
        if (right) {
            return (
                <div className="Grid Grid_right">
                    <div className="Grid-content-header">
                        <img className="Grid-icon-img" src={icon} alt="" />
                        <h2 className="Grid-content-title">{title}</h2>
                    </div>
                    <div className="Grid-image">
                        <img className="Grid-image-img" src={image} alt="" />
                    </div>
                    <div className="Grid-content-text" dangerouslySetInnerHTML={{__html: text}}></div>
                </div>
            );
        }
        return (
            <div className="Grid">
                <div className="Grid-content-header">
                    <img className="Grid-icon-img" src={icon} alt="" />
                    <h2 className="Grid-content-title text-right">{title}</h2>
                </div>
                <div className="Grid-content-text" dangerouslySetInnerHTML={{__html: text}}></div>
                <div className="Grid-image">
                    <img className="Grid-image-img" src={image} alt="" />
                </div>
            </div>
        );
    }
}

export default Grid;
