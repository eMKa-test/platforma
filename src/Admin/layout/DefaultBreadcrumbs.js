import React, { Component } from "react";
import { Route, Link, matchPath } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import * as PropTypes from "prop-types";
import classNames from "classnames";

let routes;

const getPaths = (pathname) => {
    const paths = ["/"];

    if (pathname === "/") return paths;

    pathname.split("/").reduce((prev, curr) => {
        const currPath = `${prev}/${curr}`;
        paths.push(currPath);
        return currPath;
    });
    return paths;
};

const findRouteName = (url) => {
    const aroute = routes.find(route => matchPath(url, { path: route.path, exact: route.exact }));
    return aroute && aroute.name ? aroute.name : null;
};

const BreadcrumbsItem = ({ match }) => {
    const routeName = findRouteName(match.url);
    if (routeName) {
        return match.isExact ? (
            <BreadcrumbItem active>{routeName}</BreadcrumbItem>
        ) : (
            <BreadcrumbItem>
                <Link to={match.url || ""}>{routeName}</Link>
            </BreadcrumbItem>
        );
    }
    return null;
};

BreadcrumbsItem.propTypes = {
    match: PropTypes.shape({
        url: PropTypes.string,
    }),
};

const Breadcrumbs = (args) => {
    const paths = getPaths(args.location.pathname).filter(path => path !== "/admin/");
    const items = paths
        .map((path, i) => <Route key={i.toString()}
            path={path}
            component={BreadcrumbsItem} />);
    return <Breadcrumb>{items}</Breadcrumb>;
};

const propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    appRoutes: PropTypes.any,
    tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
};

const defaultProps = {
    tag: "div",
    className: "",
    appRoutes: [
        {
            path: "/",
            exact: true,
            name: "Home",
            component: null,
        },
    ],
};

class DefaultBreadcrumbs extends Component {
    constructor(props) {
        super(props);
        routes = props.appRoutes;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.appRoutes !== this.props.appRoutes) {
            routes = this.props.appRoutes;
        }
    }

    render() {
        const { className, tag: Tag, ...attributes } = this.props;

        delete attributes.children;
        delete attributes.appRoutes;

        const classes = classNames(className);

        return (
            <Tag className={classes}>
                <Route path="/:path"
                    component={Breadcrumbs}
                    {...attributes} />
            </Tag>
        );
    }
}

DefaultBreadcrumbs.propTypes = propTypes;
DefaultBreadcrumbs.defaultProps = defaultProps;

export default DefaultBreadcrumbs;
