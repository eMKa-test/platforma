import React from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import noContentIcon from "./assets/noContentIcon.png";
import metrikaEvents, { CALENDAR_CHANGE_DATE } from "../../../common/Metrika";
import convertDate from "../../layout/header/helpers";
import styles from "./style";


const NoContent = (props) => {
    const {
        classes, date, route: { companySlug, lineID, tab }, changeDate,
    } = props;
    function selectDateWithContent() {
        metrikaEvents.emit(
            CALENDAR_CHANGE_DATE,
            { companySlug, tab, date },
            () => changeDate(props.date),
        );
    }
    const url = `/${companySlug}/content/${lineID}/${tab}/${date}`;
    return (
        <div className={classes.noContentWrapper}>
            <div className={classes.noContentBody}>
                <img
                    className={classes.noContentIcon}
                    src={noContentIcon}
                    alt="noContentIcon" />
                <h3 className={classes.noContentTitle}>На выбранную дату контент не найден</h3>
                {date ? (
                    <React.Fragment>
                        <p className={classes.noContentValue}>
                            Перейдите на ближайшую дату
                        </p>
                        <button
                            type="button"
                            className={classes.noContentLink}
                            onClick={selectDateWithContent}>
                            {convertDate(date)}
                        </button>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <p className={classes.noContentValue}>
                            Контент не был ещё загружен
                        </p>
                        <p className={classes.noContentValue}>
                            Нет досутпных дат
                        </p>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

NoContent.propTypes = {
    classes: PropTypes.object.isRequired,
    date: PropTypes.string,
    route: PropTypes.object.isRequired,
    changeDate: PropTypes.func.isRequired,
};

export default withStyles(styles)(NoContent);
