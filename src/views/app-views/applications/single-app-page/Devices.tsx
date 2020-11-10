import { Table } from "antd";
import moment from "moment";
import React from "react";
import Flex from "../../../../components/shared-components/Flex";

const tableColumns = [
    {
        title: "Device Name",
        dataIndex: "Device Name",
    },
    {
        title: "OS Type",
        dataIndex: "OSVersion",
    },
    {
        title: "App Version",
        dataIndex: "ApplicationVersion",
    },
    {
        title: "Last Access Date",
        dataIndex: "LastAccessDate",
        render: (date) => (
            <span>
                {date
                    ? moment.unix(date.slice(6, 16)).format("DD/MM/YYYY")
                    : " "}{" "}
            </span>
        ),
    },
    {
        title: "Sale Point Address",
        dataIndex: "SalePointAddress",
    },
    {
        title: "Workplace",
        dataIndex: "Workplace",
    },
];
const Devices = ({ licenses }) => {
    return (
        <>
            <Flex justifyContent="between" alignItems="center" className="py-4">
                <h2>Devices</h2>
            </Flex>
            <Table columns={tableColumns} dataSource={licenses} rowKey="ID" />
        </>
    );
};
export default Devices;
