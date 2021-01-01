import { Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { AppService } from "../../../../api";
import { ILicenses } from "../../../../api/types.response";
import Flex from "../../../../components/shared-components/Flex";
import IntlMessage from "../../../../components/util-components/IntlMessage";
enum Health {
  _GOOD = 2,
  _COLD = 7,
  _DEAD = 4,
  _OVERHEAT = 3,
  _OVERVOLTAGE = 5,
  _UNSPECIFIED_FAILURE = 6,
  _UNKNOWN = 1,
}
enum Plugged {
  _AC = 1,
  _USB = 2,
  _WIRELESS = 4,
}
enum Status {
  _DISCHARGING = 3,
  _NOT_CHARGING = 4,
  _FULL = 5,
  _CHARGING = 2,
}
const tableColumns = [
  {
    title: "Device Name",
    dataIndex: "DeviceName",
  },
  {
    title: "OS Version",
    dataIndex: "OSVersion",
  },
  {
    title: "App Version",
    dataIndex: "ApplicationVersion",
  },
  {
    title: "Last Access Date",
    dataIndex: "LastAccessDate",
    render: (date: ILicenses["LastAccessDate"]) => (
      <span>
        {date ? moment.unix(+date.slice(6, 16)).format("DD/MM/YYYY") : " "}
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
const Devices = ({ AppType }: { AppType: number }) => {
  const [devices, setDevices] = useState<any>();
  const getDevices = async (AppType: number) => {
    return new AppService().GetAppLicenses(AppType).then((data) => {
      if (data) {
        if (data.ErrorCode === 0) {
          setDevices(
            data.LicenseList.filter((elm: ILicenses) => elm.Status !== 0)
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
