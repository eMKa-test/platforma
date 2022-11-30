import React from "react";
import ReactDOM from "react-dom";

const WebView = React.lazy(() => import("./WebView"));

const hideLoader = () => {
    document.getElementById("site-loader").style.display = "none";
};

const Root = React.memo(function Root() {
    return (
        <React.Suspense fallback={<span />}>
            <WebView onMount={hideLoader} />
        </React.Suspense>
    );
});

ReactDOM.render((<Root />), document.getElementById("root"));
