import React, { useEffect, useState } from "react";
import { Button, Table, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import moment from "moment";
import { AppService } from "../../../../../api/app";
import { ILicenses } from "../../../../../api/app/app.types";
import Flex from "../../../../../components/shared-components/Flex";
import IntlMessage from "../../../../../components/util-components/IntlMessage";
import DeviceView from "./DeviceView";
import TranslateText from "../../../../../utils/translate";
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
  _NOT_PLUGGED = -1,
}
export enum Status {
  _DISCHARGING = 3,
  _NOT_CHARGING = 4,
  _FULL = 5,
  _CHARGING = 2,
}
enum EnOsType {
  WINDOWS = 1,
  ANDROID = 2,
  IOS = 3,
  LINUX = 4,
}
const Devices = ({ AppType }: { AppType: number }) => {
  const instance = new AppService();
  const [loading, setLoading] = useState<boolean>(true);
  const [devices, setDevices] = useState<any>();
  const [selectedDevice, setSelectedDevice] = useState<any>();
  const [selectedLicense, setSelectedLicense] = useState<any>();
  const [deviceViewVisible, setDeviceViewVisible] = useState<boolean>(false);
  const getDevices = async (AppType: number) => {
    return instance.GetAppLicenses(AppType).then((data) => {
      setLoading(false);
      if (data && data.ErrorCode === 0) {
        setDevices(
          data.LicenseList.filter((elm: ILicenses) => elm.Status !== 0)
        );
      }
    });
  };
  useEffect(() => {
    getDevices(AppType);
    return () => instance._source.cancel();
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
            title: TranslateText("app.devices.deviceName"),
            dataIndex: "DeviceName",
          },
          {
            title: TranslateText("app.devices.osType"),
            dataIndex: "OSType",
            render: (OSType) => (
              <span>
                {OSType === EnOsType.WINDOWS
                  ? "Winows"
                  : OSType === EnOsType.ANDROID
                  ? "Android"
                  : OSType === EnOsType.IOS
                  ? "iOS"
                  : "Linux"}
              </span>
            ),
          },
          {
            title: TranslateText("app.devices.osVersion"),
            dataIndex: "OSVersion",
          },
          {
            title: TranslateText("app.devices.appVersion"),
            dataIndex: "ApplicationVersion",
          },
          {
            title: "IP",
            dataIndex: "PrivateIP",
          },
          {
            title: TranslateText("app.devices.lastAccessDate"),
            dataIndex: "LastAccessDate",
            render: (date: ILicenses["LastAccessDate"]) => (
              <span>
                {date
                  ? moment.unix(+date.slice(6, 16)).format("DD/MM/YYYY")
                  : " "}
              </span>
            ),
          },
          {
            dataIndex: "actions",
            render: (_, elm) => (
              <div className="text-right">
                <Tooltip title={TranslateText("app.devices.view")}>
                  <Button
                    type="primary"
                    className="mr-2"
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={async () => {
                      setDeviceViewVisible(true);
                      setSelectedDevice(JSON.parse(elm.DiagnosticInformation));
                      setSelectedLicense(elm);
                    }}
                  />
                </Tooltip>
              </div>
            ),
          },
        ]}
        dataSource={devices}
        rowKey="ID"
        loading={loading}
      />
      <DeviceView
        data={selectedDevice ?? []}
        licenseData={selectedLicense ?? []}
        visible={deviceViewVisible}
        close={() => setDeviceViewVisible(false)}
      />
    </>
  );
};
export default Devices;
