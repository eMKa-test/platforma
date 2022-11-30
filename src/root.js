import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import metrikaEvents, { START } from "./common/Metrika";
import Mobile from "./Mobile";

const ProviderStore = React.lazy(() => import("./Desktop/providers/ProviderStore"));
const Welcome = React.lazy(() => import("./Welcome"));
const Desktop = React.lazy(() => import("./Desktop"));

class Root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            loading: true,
            user: null,
            isMobile: false,
        };
    }

    componentDidMount() {
        if (/iPhone|iPad|iPod|Android|webOS/i.test(navigator.userAgent)) {
            this.setState({isMobile: true}, () => {
                document.addEventListener("scroll", this.hideMobileBanner);
            });
        }
        this.start();
    }

    hideMobileBanner = () => {
        this.setState({isMobile: false}, () => {
            document.removeEventListener("scroll", this.hideMobileBanner);
        });
    };

    start = async () => {
        const { pathname } = window.location;
        if (pathname.includes("logout")) {
            return this.setState({ auth: false, loading: false }, () => {
                fetch("/api/logout");
            });
        }
        try {
            const res = await fetch("/user/api/my");
            if (res.ok) {
                const { success = false, payload: user } = await res.json();
                if (success) {
                    this.setState({ auth: true, user });
                }
            }
        } catch (e) {
            // ...
        } finally {
            this.setState({ loading: false });
            metrikaEvents.emit(START, {
                // для понимания с какой страницы начат просмотр,
                // есть ли обмен ссылками между пользователями или закладки
                pathname,
            });
        }
        return null;
    };

    hideLoader = () => {
        document.getElementById("site-loader").style.display = "none";
    };

    onMount = () => {
        this.hideLoader();
    };

    render() {
        if (this.state.loading) {
            return null;
        }
        const { auth, user, isMobile } = this.state;
        return (
            <React.Fragment>
                <Mobile
                    show={isMobile}
                    onClose={this.hideMobileBanner} />
                <React.Suspense fallback={<span />}>
                    {auth ? (
                        <ProviderStore user={user}>
                            <Desktop onMount={this.onMount} />
                        </ProviderStore>
                    ) : (
                        <Welcome onMount={this.onMount} />
                    )}
                </React.Suspense>
            </React.Fragment>
        );
    }
}

document.documentElement.className += "ontouchstart" in document.documentElement ? "touch" : "no-touch";

ReactDOM.render((
    <BrowserRouter>
        <Root />
    </BrowserRouter>
), document.getElementById("root"));
