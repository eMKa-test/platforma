const styledCompanyMenu = () => ({
    companyToggler: {
        transform: "rotate(180deg)",
        transition: "transform 200ms ease",
    },
    companyToggler__open: {
        transform: "rotate(180deg)",
    },
    companyToggler__close: {
        transform: "rotate(0)",
    },
    companyDropList: {
        paddingBottom: 24,
    }
});

export default styledCompanyMenu;
