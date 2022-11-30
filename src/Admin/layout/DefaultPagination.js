import React from "react";
import * as PropTypes from "prop-types";
import RCPagination from "rc-pagination";
import RCSelect from "rc-select";

const pageSizeOptions = ["12", "48", "96"];
const locale = {
    items_per_page: "/ стр",
    jump_to: "Перейти",
    jump_to_confirm: "подтвердить",
    page: "",
    prev_page: "Назад",
    next_page: "Вперед",
    prev_5: "Предыдущие 5",
    next_5: "Следующие 5",
    prev_3: "Предыдущие 3",
    next_3: "Следующие 3",
};

export const defaultSettings = {
    page: 1,
    limit: 12,
};

class DefaultPagination extends React.Component {
    static propTypes = {
        pagination: PropTypes.shape({
            page: PropTypes.number,
        }).isRequired,
        total: PropTypes.number,
    }

    state = {
        limit: 12,
    }

    handlePagination = (page, limit) => {
        this.setState(() => ({ limit }), () => this.props.onPagination(page, limit));
    }

    renderTotal=(total) => `Всего: ${total} шт.`;

    render() {
        const { limit } = this.state;
        const { page } = this.props.pagination;
        const { total } = this.props;
        return (
            <RCPagination
                showTotal={this.renderTotal}
                onChange={this.handlePagination}
                locale={locale}
                selectComponentClass={RCSelect}
                showSizeChanger
                onShowSizeChange={this.handlePagination}
                current={page}
                pageSize={limit}
                pageSizeOptions={pageSizeOptions}
                showTitle={false}
                total={total} />
        );
    }
}

export default DefaultPagination;
