import React from "react";
import { Dropdown, Menu } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
export interface IEllipsisDropdown {
    menu: any;
    placement?: any;
}
const EllipsisDropdown = ({
    menu = <Menu />,
    placement = "bottomRight",
}: IEllipsisDropdown) => {
    return (
        <Dropdown overlay={menu} placement={placement} trigger={["click"]}>
            <div className="ellipsis-dropdown">
                <EllipsisOutlined />
            </div>
        </Dropdown>
    );
};

// EllipsisDropdown.propTypes = {
//     trigger: PropTypes.string,
//     placement: PropTypes.string,
// };

// EllipsisDropdown.defaultProps = {
//     trigger: "click",
//     placement: "bottomRight",
//     menu: <Menu />,
// };

export default EllipsisDropdown;
