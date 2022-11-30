import isEmpty from "lodash/isEmpty";
import ReactDOM from "react-dom";
import React, { Component } from "react";

import metrikaEvents, { SHARE_VIEW } from "../common/Metrika";
import { SHARE } from "../constants";
import FullscreenContent from "../Desktop/components/gallery/fullscreenContent";

import "./style.css";
import { getData } from "../ContentProvider/fetch";

class Root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            loading: true,
            content: [],
        };
    }

    componentDidMount() {
        this.start();
    }

    start = async () => {
        const { searchParams, pathname } = new URL(window.location.href);
        const src = searchParams.get("source");
        let auth, content;
        try {
            auth = await getData({ url: src }, false);
        } catch (e) {
            // ...
        } finally {
            const type = pathname.split("/")[2];
            const item = {
                src: { src, tmb: src },
                type: type.toUpperCase(),
            };
            if (auth) {
                content = [item];
            }
            this.setState({ auth, loading: false, content }, () => {
                this.onMount();
                metrikaEvents.emit(SHARE_VIEW, item);
            });
        }
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
        if (!this.state.auth) {
            return (
                <p className="share-noauth">Вы не авторизованы для просмотра данного контента</p>
            );
        }
        const { content } = this.state;
        return (
            <div className="share-wrapper">
                {
                    (!isEmpty(content)) ? (
                        <FullscreenContent
                            noHoverZone
                            idx={0}
                            content={content}
                            contentType={SHARE} />
                    ) : "Не верная ссылка для показа"
                }
            </div>
        );
    }
}

ReactDOM.render((
    <Root />
), document.getElementById("root"));
