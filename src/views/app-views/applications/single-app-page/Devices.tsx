import { Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ClientApi } from "../../../../api";
import Flex from "../../../../components/shared-components/Flex";
import IntlMessage from "../../../../components/util-components/IntlMessage";

const tableColumns = [
    {
        title: "Device Name",
        dataIndex: "DeviceName",
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
        render: (date: any) => (
            <span>
                {date
                    ? moment.unix(date.slice(6, 16)).format("DD/MM/YYYY")
                    : " "}
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
const Devices = ({ AppType }: any) => {
    const [devices, setDevices] = useState<any>();
    const getDevices = (AppType: any) => {
        return new ClientApi().GetAppLicenses(AppType).then((data: any) => {
            if (data) {
                if (data.ErrorCode === 0) {
                    setDevices(
                        data.LicenseList.filter((elm: any) => elm.Status !== 0)
                    );
                }
            }
        });
    };
    useEffect(() => {
        getDevices(AppType);
    }, []);
    return (
        <>
            <Flex justifyContent="between" alignItems="center" className="py-4">
                <h2>
                    <IntlMessage id="app.Devices" />
                </h2>
            </Flex>
            <Table columns={tableColumns} dataSource={devices} rowKey="ID" />
        </>
    );
};
export default Devices;
