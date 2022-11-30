import React, { Component, Fragment } from "react";
import * as PropTypes from "prop-types";
import M from "marzipano";

const panorams = {
    limiter: () => {
        return M.RectilinearView.limit.traditional(
            1024 * 3,
            100 * Math.PI / 180,
        );
    },
    inititalView: {
        yaw: 0,
        pitch: 0,
        fov: 100 * Math.PI / 180,
    },
};

const geometry = new M.EquirectGeometry([{ width: "512px" }]);
const view = new M.RectilinearView(panorams.inititalView, panorams.limiter());

const options = ({ source }) => ({
    source,
    geometry,
    view,
    pinFirstLevel: true,
});

let scene;

class PanoramPreview extends Component {
    static propTypes = {
        panorama: PropTypes.object,
        showMeEditContent: PropTypes.number,
    };

    state = {
        viewer: null,
    };

    node = React.createRef();

    componentDidMount() {
        const viewer = new M.Viewer(this.node.current);
        this.setState(() => ({ viewer }), () => {
            if (this.props.panorama ) {
                this.processMarzipano();
            }
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.panorama !== this.props.panorama && this.props.panorama !== undefined) {
            this.processMarzipano();
        }
    }

    processMarzipano = () => {
        const { panorama, showMeEditContent } = this.props;
        if (panorama.id === showMeEditContent) {
            const source = M.ImageUrlSource.fromString(panorama.src.src);
            this.switchScene(source);
        }
    };

    switchScene = (source) => {
        const { viewer } = this.state;
        scene = viewer.createScene(options({ source }));
        scene.switchTo({ transitionDelay: 100 });
    }

    render() {
        return (
            <Fragment>
                <div className="marz-container">
                    <div
                        className="wrapper-panorams">
                        <div
                            ref={this.node}
                            className="panos" />
                    </div>
                </div>
            </Fragment>
        );
    }
}
export default PanoramPreview;
