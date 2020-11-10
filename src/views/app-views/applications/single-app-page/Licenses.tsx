import { Button, Col, Empty, Row, Table, Tag } from "antd";
import React, { useEffect } from "react";
import Flex from "../../../../components/shared-components/Flex";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";

const tableColumns = [
    {
        title: "License Code",
        dataIndex: "LicenseCode",
    },
    {
        title: "Create Date",
        dataIndex: "CreateDate",
        render: (CreateDate) => (
            <span>
                {CreateDate
                    ? moment.unix(CreateDate.slice(6, 16)).format("DD/MM/YYYY")
                    : " "}{" "}
            </span>
        ),
    },
    {
        title: "Activation Date",
        dataIndex: "LicenseActivationDate",
    },
    {
        title: "Status",
        dataIndex: "Status",
        render: (Status) => (
            <div className="text-right">
                <Tag className="mr-0" color={Status === 1 ? "cyan" : "volcano"}>
                    {Status === 1 ? "Active" : "Not Active"}
                </Tag>
            </div>
        ),
    },
];
const Licenses = ({ licenses, setCreateLicenseVisible }: any) => {
    return (
        <>
            <Flex justifyContent="between" alignItems="center" className="py-2">
                <h2>Licenses</h2>
                <div>
                    <Button
                        type="primary"
                        className="ml-2"
                        onClick={() => setCreateLicenseVisible(true)}
                    >
                        <PlusOutlined />
                        <span>New</span>
                    </Button>
                </div>
            </Flex>
            <div className="my-4 container-fluid">
                <Row>
                    <Table
                        className="no-border-last"
                        columns={tableColumns}
                        dataSource={licenses}
                        rowKey="ID"
                        pagination={false}
                    />
                </Row>
            </div>
        </>
    );
};
export default Licenses;
