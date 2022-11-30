import React from "react";
import * as PropTypes from "prop-types";

const ProvideRegisterDataContext = React.createContext({
    mail: "",
});

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mail: "",
        };
    }

    setUserMail = (val) => {
        this.setState({
            mail: val,
        });
    };

    render() {
        return (
            <ProvideRegisterDataContext.Provider
                value={{
                    mail: this.state.mail,
                    setUserMail: this.setUserMail,
                }}>
                {this.props.children}
            </ProvideRegisterDataContext.Provider>
        );
    }
}

Index.propTypes = {
    children: PropTypes.element.isRequired,
};

const ConnectProvideRegisterData = Index;

export { ConnectProvideRegisterData as default, ProvideRegisterDataContext };
