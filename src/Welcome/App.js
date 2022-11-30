import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import View from "./Components/View";
import views from "./views";
import Header from "./Components/Header";
import ViewCounter from "./Components/ViewCounter";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewIndex: 0,
            scrollDir: 0,
            touchY: 0,
        };
    }

    componentDidMount() {
        this.props.onMount();
    }

    changeDir = (force) => {
        let { scrollDir } = this.state;
        if (scrollDir === 0) {
            scrollDir = force;
        } else {
            scrollDir = Math.sign(force) === Math.sign(scrollDir) ? scrollDir + force : force;
        }
        this.setState(() => ({ scrollDir }));
    };

    handleToggleView = viewIndex => this.setState({ viewIndex });

    handleScroll = ({ deltaY }) => {
        const { scrollDir, viewIndex } = this.state;
        if (deltaY > 0) {
            if (viewIndex >= views.length - 1) {
                return;
            }
            if (scrollDir > 5) {
                // eslint-disable-next-line
                return this.setState({ viewIndex: viewIndex + 1, scrollDir: 0 });
            }
            this.changeDir(1);
        } else {
            if (viewIndex <= 0) {
                return;
            }
            if (scrollDir < -5) {
                // eslint-disable-next-line
                return this.setState({ viewIndex: viewIndex - 1, scrollDir: 0 });
            }
            this.changeDir(-1);
        }
    };

    handleTouchStart = ev => this.setState({ touchY: ev.touches[0].clientY });

    handleTouchEnd = (ev) => {
        const delta = this.state.touchY - ev.changedTouches[0].clientY;
        if ((delta > 0 && delta < 100) || (delta < 0 && delta > -100)) {
            return;
        }
        let nextView = this.state.viewIndex;
        if (Math.sign(delta) > 0) {
            if (nextView >= views.length - 1) {
                return;
            }
            nextView += 1;
        } else {
            if (nextView <= 0) {
                return;
            }
            nextView -= 1;
        }
        this.setState({ viewIndex: nextView, scrollDir: 0 });
    };

    setPosition = (viewIndex) => ({ transform: `translateY(-${viewIndex * 100}%)` });

    renderCounter = () => {
        const { viewIndex, scrollDir } = this.state;
        const dir = Math.sign(scrollDir) === -1 ? "UP" : "DOWN";
        const height = Math.abs(scrollDir) || 0;
        return (
            <ViewCounter
                viewIndex={viewIndex}
                viewsCount={views.length}
                toggleView={this.handleToggleView}
                dir={dir}
                height={height} />
        );
    };

    render() {
        const { viewIndex } = this.state;
        return (
            <div
                className="App"
                onWheel={this.handleScroll}
                onTouchStart={this.handleTouchStart}
                onTouchEnd={this.handleTouchEnd}>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
                {this.renderCounter()}
                <div className="scroll-wrapper-background"
                    style={this.setPosition(viewIndex)}>
                    {views.map((route) => <View key={route.id}
                        className={route.className} />)}
                </div>
                <div className="scroll-wrapper-content"
                    style={this.setPosition(viewIndex)}>
                    {views.map((route) => (
                        <View key={route.id}
                            className={route.contentClassName}>
                            <route.component {...route.rest} />
                        </View>
                    ))}
                </div>
            </div>
        );
    }
}

export default App;
