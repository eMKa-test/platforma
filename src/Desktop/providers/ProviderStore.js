import React from "react";
import * as PropTypes from "prop-types";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { RightsProvider } from "./Rights";
import { WindowSizeProvider } from "./WindowSize";
import { DatesProvider } from "./Dates";
import { LoaderProvider } from "./ContentLoader";
import { MapActivityProvider } from "./MapActivity";
import { CalendarActivityProvider } from "./CalendarActivity";
import { ModelActivityProvider } from "./ModelActivity";
import theme from "../common/theme";

const ProviderStore = (props) => {
    return (
        <MuiThemeProvider theme={theme}>
            <WindowSizeProvider>
                <RightsProvider user={props.user}>
                    <DatesProvider>
                        <LoaderProvider>
                            <MapActivityProvider>
                                <CalendarActivityProvider>
                                    <ModelActivityProvider>
                                        {props.children}
                                    </ModelActivityProvider>
                                </CalendarActivityProvider>
                            </MapActivityProvider>
                        </LoaderProvider>
                    </DatesProvider>
                </RightsProvider>
            </WindowSizeProvider>
        </MuiThemeProvider>
    );
};

ProviderStore.propTypes = {
    children: PropTypes.element.isRequired,
    user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        status: PropTypes.oneOf(["ACTIVE"]).isRequired,
    }).isRequired,
};

export default React.memo(ProviderStore);
