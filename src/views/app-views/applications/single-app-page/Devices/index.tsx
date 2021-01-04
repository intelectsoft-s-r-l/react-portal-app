import React, { useEffect, useState } from "react";
import { Button, Table, Tooltip } from "antd";
import { EyeOutlined } from '@ant-design/icons'
import moment from "moment";
import { AppService } from "../../../../../api";
import { IDiagnosticInformation, ILicenses } from "../../../../../api/types.response";
import Flex from "../../../../../components/shared-components/Flex";
import IntlMessage from "../../../../../components/util-components/IntlMessage";
import DeviceView from "./DeviceView";
export enum Health {
  _GOOD = 2,
  _COLD = 7,
  _DEAD = 4,
  _OVERHEAT = 3,
  _OVERVOLTAGE = 5,
  _UNSPECIFIED_FAILURE = 6,
  _UNKNOWN = 1,
}
export enum Plugged {
  _AC = 1,
  _USB = 2,
  _WIRELESS = 4,
  _NOT_PLUGGED = -1
}
export enum Status {
  _DISCHARGING = 3,
  _NOT_CHARGING = 4,
  _FULL = 5,
  _CHARGING = 2,
}
const Devices = ({ AppType }: { AppType: number }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [devices, setDevices] = useState<any>();
  const [selectedDevice, setSelectedDevice] = useState<Partial<IDiagnosticInformation>>()
  const [deviceViewVisible, setDeviceViewVisible] = useState<boolean>(false)
  const getDevices = async (AppType: number) => {
    return new AppService().GetAppLicenses(AppType).then((data) => {
      if (data) {
        if (data.ErrorCode === 0) {
          setLoading(false);
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
      <Table
        columns={[
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
          {
            dataIndex: "actions",
            render: (_, elm) => (
              <div className="text-right">
                <Tooltip title="View">
                  <Button type="primary" className="mr-2" icon={<EyeOutlined />} size="small" onClick={async () => {
                    await setDeviceViewVisible(true)
                    await setSelectedDevice(JSON.parse(elm.DiagnosticInformation))
                  }} />
                </Tooltip>
              </div>
            )
          }
        ]}
        dataSource={devices}
        rowKey="ID"
        loading={loading}
      />
      <DeviceView data={selectedDevice ?? {}} visible={deviceViewVisible} close={() => setDeviceViewVisible(false)} isTable={true} />
    </>
  );
};
export default Devices;
