import React from "react";
import * as PropTypes from "prop-types";
import isEqual from "lodash/isEqual";
import ErrorBoundary from "common/ErrorBoundary";

import { getData } from "./fetch";

const PAGINATION_LIMIT = 12;
const CANCEL_REQUEST_MESSAGE = "CANCEL_REQUEST";

class ContentProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            payload: [],
            total: 0,
            page: 1,
            limit: PAGINATION_LIMIT,
            params: {},
        };
        this.cancel = () => null;
    }

    componentDidMount() {
        const { startParams } = this.props;
        if (startParams) {
            this.setState({ params: startParams, page: 1 }, this.init);
        } else {
            this.init();
        }
    }

    init = () => {
        if (this.props.url) {
            this.getData();
        }
    };

    // eslint-disable-next-line consistent-return
    componentDidUpdate(prevProps) {
        if (prevProps.url !== this.props.url) {
            this.cancelRequest();
            return this.getData();
        }
        if (!isEqual(prevProps.startParams, this.props.startParams)) {
            this.setState({ params: this.props.startParams, page: 1 }, () => {
                this.cancelRequest();
                this.getData();
            });
        }
    }

    cancelRequest = () => {
        if (typeof this.cancel === "function") {
            this.cancel(CANCEL_REQUEST_MESSAGE);
        }
    };

    componentWillUnmount() {
        this.cancelRequest();
    }

    refresh = () => {
        this.getData();
    };

    onChangePage = (page) => {
        this.setState(() => ({ page }), this.getData);
    };

    onChangeRowsPerPage = (limit) => {
        this.setState(() => ({ limit }), this.getData);
    };

    makeOnChangeParam = (paramName) => (val) => {
        this.setState((state) => ({
            params: {
                ...state.params,
                [paramName]: val,
            },
        }), this.getData);
    };

    getData = () => {
        this.setState(
            () => ({ loading: true }),
            () => {
                this.cancelRequest();
                const { url } = this.props;

                const {
                    limit, page, params: _params,
                } = this.state;

                // prepare fetch params
                const params = {
                    ..._params,
                    limit,
                    page,
                };

                // fetch action
                const errCallback = () => this.setState({ loading: false });
                const [payloadPromise, cancel] = getData({
                    url,
                    params,
                    errCallback,
                }, true /* cancellable */);
                if (typeof this.cancel === "function") {
                    this.cancel = cancel;
                }
                if (typeof payloadPromise.then === "function") {
                    payloadPromise.then(this.handleServerResponse)
                        .catch(() => null);
                }
            },
        );
    };

    handleServerResponse = (res) => {
        const { payload = [], pagination: { total = 0, limit = 12, page = 0 } = {} } = res;
        this.setState(() => ({
            payload,
            total,
            limit,
            page,
            loading: false,
        }));
    };

    render() {
        return (
            <ErrorBoundary>
                {this.props.children({
                    ...this.state,
                    refresh: this.refresh,
                    onChangePage: this.onChangePage,
                    onChangeRowsPerPage: this.onChangeRowsPerPage,
                    makeOnChangeParam: this.makeOnChangeParam,
                })}
            </ErrorBoundary>
        );
    }
}

ContentProvider.propTypes = {
    children: PropTypes.func.isRequired,
    url: PropTypes.string,
    startParams: PropTypes.shape({}),
};

export default ContentProvider;
