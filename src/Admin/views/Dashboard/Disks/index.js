import React from "react";
import ContentProvider from "../../../../ContentProvider";

const checkSpaceResult = (val) => {
    if (val > 999999999) {
        const num = val / (1024 ** 3);
        return `${num.toFixed(1)} Гб`;
    }
    const num = val / (1024 ** 2);
    return `${Math.floor(num)} Мб`;
};

const setProgressBar = (free, total, out = true) => {
    const res = {};
    // eslint-disable-next-line no-mixed-operators
    const result = (100 - (free / (1024 ** 3)) / (total / (1024 ** 3)) * 100).toFixed(1);
    res.width = `${result}%`;
    if (out) return res;
    return `${result}%`;
};

const getStatus = (disk) => {
    return (disk.info.available / disk.info.total) * 100;
};


function Disks() {
    return (
        <div className="admin-main-diskusage_wrapper">
            <h4 className="mb-4">Информация по дискам</h4>
            <ContentProvider url="/admin/api/dashboard">
                {({ payload: { disks }, loading }) => (
                    <div>
                        {loading && <span /> /* можно какой-нить потом лоадер вставить */}
                        {Array.isArray(disks) && disks.map((disk, i) => (
                            <div key={String(i)}>
                                <h5>
                                    Раздел:
                                    {" "}
                                    {disk.title}
                                </h5>
                                <div className="progress">
                                    <div
                                        className={`progress-bar ${
                                            getStatus(disk) < 20 ? "bg-danger" : "bg-success"
                                        } text-dark`}
                                        role="progressbar"
                                        style={setProgressBar(disk.info.available, disk.info.total)}
                                        aria-valuemin="0"
                                        aria-valuemax="100">
                                        {setProgressBar(disk.info.available, disk.info.total, false)}
                                    </div>
                                </div>
                                <p className="text-center mt-2 disks-info">
                                    Доступно:
                                    {" "}
                                    {checkSpaceResult(disk.info.available)}
                                    {" "}
                                    из
                                    {" "}
                                    {checkSpaceResult(disk.info.total)}
                                </p>
                                <hr />
                            </div>
                        ))}
                    </div>
                )}
            </ContentProvider>
        </div>
    );
}

Disks.propTypes = {
    // ...
};

export default Disks;
