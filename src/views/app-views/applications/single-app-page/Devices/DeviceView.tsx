import * as React from "react";
import { Drawer, Divider, Typography } from "antd";
import { IDiagnosticInformation } from "../../../../../api/app/app.types";
import { Health, Plugged, Status } from ".";
import TranslateText from "../../../../../utils/translate";
import "./devices.scss";

interface IDeviceView {
  visible: boolean;
  data: Partial<IDiagnosticInformation>;
  close: () => void;
}
const DeviceView = ({ visible, data, close }: IDeviceView) => {
  return (
    <Drawer
      width={500}
      placement="right"
      onClose={close}
      closable={true}
      visible={visible}
    >
      <h3 className="text-left mt-3">
        {TranslateText("app.devices.deviceInformation")}
      </h3>
      <div className="mt-2">
        Last update: <span className="ml-2">{data.Date ?? "Unknown"}</span>
      </div>
      <Divider dashed />
      <div className="">
        <table className="diagnostic-table">
          <thead>
            <tr>
              <th>{TranslateText("app.devices.battery")}</th>
              <th>{TranslateText("app.devices.value")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{TranslateText("app.devices.level")}</td>
              <td>{data.Battery ? data.Battery.Level + " %" : "--"}</td>
            </tr>
            <tr>
              <td>{TranslateText("app.devices.voltage")}</td>
              <td>{data.Battery ? data.Battery.Voltage : "--"}</td>
            </tr>
            <tr>
              <td>{TranslateText("app.devices.plugged")}</td>
              <td>
                {data.Battery
                  ? data.Battery.Plugged === Plugged._AC
                    ? TranslateText("app.devices.plugged.AC")
                    : data.Battery.Plugged === Plugged._USB
                    ? TranslateText("app.devices.plugged.USB")
                    : data.Battery.Plugged === Plugged._WIRELESS
                    ? TranslateText("app.devices.plugged.wireless")
                    : TranslateText("app.devices.plugged.notConnected")
                  : "--"}
              </td>
            </tr>
            <tr>
              <td>{TranslateText("app.devices.health")}</td>
              <td>
                {data.Battery
                  ? data.Battery.Health === Health._COLD
                    ? TranslateText("app.devices.health.cold")
                    : data.Battery.Health === Health._DEAD
                    ? TranslateText("app.devices.health.dead")
                    : data.Battery.Health === Health._GOOD
                    ? TranslateText("app.devices.health.good")
                    : data.Battery.Health === Health._OVERHEAT
                    ? TranslateText("app.devices.health.overheat")
                    : data.Battery.Health === Health._OVERVOLTAGE
                    ? TranslateText("app.devices.health.overvoltage")
                    : data.Battery.Health === Health._UNKNOWN
                    ? TranslateText("app.devices.health.unknown")
                    : TranslateText("app.devices.health.unspecified")
                  : "--"}
              </td>
            </tr>
            <tr>
              <td>{TranslateText("app.devices.status")}</td>
              <td>
                {data.Battery
                  ? data.Battery.Status === Status._CHARGING
                    ? TranslateText("app.devices.status.charging")
                    : data.Battery.Status === Status._DISCHARGING
                    ? TranslateText("app.devices.status.discharging")
                    : data.Battery.Status === Status._FULL
                    ? TranslateText("app.devices.status.full")
                    : TranslateText("app.devices.status.notCharging")
                  : "--"}
              </td>
            </tr>
            <tr>
              <td>{TranslateText("app.devices.temperature")}</td>
              <td>{data.Battery ? data.Battery.Temperature : "--"}</td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th>{TranslateText("app.devices.memory")}</th>
              <th>{TranslateText("app.devices.value")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{TranslateText("app.devices.installed")}</td>
              <td>{data.Memory ? data.Memory.Installed : "--"}</td>
            </tr>
            <tr>
              <td>{TranslateText("app.devices.used")}</td>
              <td>{data.Memory ? data.Memory.Used : "--"}</td>
            </tr>
            <tr>
              <td>{TranslateText("app.devices.free")}</td>
              <td>{data.Memory ? data.Memory.Free : "--"}</td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th>{TranslateText("app.devices.wifi")}</th>
              <th>{TranslateText("app.devices.value")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{TranslateText("app.devices.connected")}</td>
              <td>
                {data.WiFi
                  ? data.WiFi.Connected
                    ? TranslateText("app.devices.connected.true")
                    : TranslateText("app.devices.connected.false")
                  : "--"}
              </td>
            </tr>
            <tr>
              <td>SSID</td>
              <td>
                {data.WiFi ? (data.WiFi.SSID ? data.WiFi.SSID : "--") : "--"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Drawer>
  );
};

export default DeviceView;
