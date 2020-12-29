import { Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { AppService } from "../../../../api";
import { ILicenses } from "../../../../api/types.response";
import Flex from "../../../../components/shared-components/Flex";
import IntlMessage from "../../../../components/util-components/IntlMessage";
enum Health {
  _good = 2,
  _cold = 7,
  _dead = 4,
  _overheat = 3,
  _overvoltage = 5,
  _unspecified_failurej = 6,
  _unknown = 1,
}
enum Plugged {
  _ac = 1,
  _usb = 2,
  _wireless = 4,
}
enum Status {
  _discharging = 3,
  _not_charging = 4,
  _full = 5,
  _charging = 2,
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
