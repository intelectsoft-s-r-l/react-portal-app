import * as React from 'react'
import { useEffect, useState } from 'react'
import { Drawer, Divider, Progress, Empty, } from 'antd'
import { IDiagnosticInformation, ILicenses } from '../../../../../api/types.response';
import { Health, Plugged, Status } from '.';
import Flex from '../../../../../components/shared-components/Flex';
import { Doughnut } from 'react-chartjs-2';
import { COLOR_2, COLOR_4 } from '../../../../../constants/ChartConstant';
import "./devices.scss";

interface IDeviceView {
    visible: boolean
    data: Partial<IDiagnosticInformation>;
    close: () => void;
    isTable: boolean;
}
const DeviceView = ({ visible, data, close, isTable }: IDeviceView) => {

    const healthCheck = (batteryHealth: IDiagnosticInformation["Battery"]["Health"]) => {
        switch (batteryHealth) {
            case Health._COLD:
                return "cold"
            case Health._DEAD:
                return "dead"
            case Health._GOOD:
                return "good"
            case Health._OVERHEAT:
                return "overheat"
            case Health._OVERVOLTAGE:
                return "overvoltage"
            case Health._UNKNOWN:
                return "unknown"
            case Health._UNSPECIFIED_FAILURE:
                return "having an unspecified failure"
            default:
                return "unknown"
        }
    }
    if (isTable) {
        return (
            <Drawer width={500} placement="right" onClose={close} closable={true} visible={visible}>
                <h3 className="text-left mt-3">Device Information</h3>
                <Divider dashed />
                <div className="">
                    <table className="diagnostic-table">
                        <thead>
                            <tr>
                                <th>
                                    Battery
                            </th>
                                <th>
                                    Value
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    Level
                            </td>
                                <td>
                                    {data.Battery ? data.Battery.Level + " %" : ""}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Voltage
                            </td>
                                <td>
                                    {data.Battery ? data.Battery.Voltage : ""}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Plugged
                            </td>
                                <td>
                                    {data.Battery ? data.Battery.Plugged === Plugged._AC
                                        ? "AC"
                                        : data.Battery.Plugged === Plugged._USB
                                            ?
                                            "USB"
                                            : data.Battery.Plugged === Plugged._WIRELESS ?
                                                "Wireless"
                                                : "Not connected"
                                        :
                                        ""
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Health
                            </td>
                                <td>
                                    {data.Battery ? data.Battery.Health === Health._COLD
                                        ? "Cold"
                                        : data.Battery.Health === Health._DEAD
                                            ?
                                            "Dead"
                                            : data.Battery.Health === Health._GOOD ?
                                                "Good"
                                                : data.Battery.Health === Health._OVERHEAT ?
                                                    "Overheat"
                                                    : data.Battery.Health === Health._OVERVOLTAGE ?
                                                        "Overvoltage"
                                                        : data.Battery.Health === Health._UNKNOWN ?
                                                            "Unknown"
                                                            : "Unscpecified failure"
                                        :
                                        ""
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Status
                            </td>
                                <td>
                                    {data.Battery ? data.Battery.Status === Status._CHARGING
                                        ? "Charging"
                                        : data.Battery.Status === Status._DISCHARGING
                                            ? "Discharging"
                                            : data.Battery.Status === Status._FULL
                                                ? "Full"
                                                : "Not charging"
                                        :
                                        ""
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Temperature
                            </td>
                                <td>
                                    {data.Battery ? data.Battery.Temperature : ""}
                                </td>
                            </tr>
                        </tbody>
                        <thead>
                            <tr>
                                <th>
                                    Memory
                            </th>
                                <th>
                                    Value
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    Installed
                                </td>
                                <td>
                                    {data.Memory ? data.Memory.Installed : ""}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Used
                                </td>
                                <td>
                                    {data.Memory ? data.Memory.Used : ""}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Free
                                </td>
                                <td>
                                    {data.Memory ? data.Memory.Free : ""}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Drawer>
        )
    }
    return (
        <Drawer width={500} placement={"right"} onClose={close} closable={true} visible={visible}>
            <h3 className="text-left mt-3">Diagnostic Information</h3>
            <Divider dashed />
            <div className="">
                <h4 className="mb-2">Battery</h4>
                {data.Battery ? (
                    <Flex alignItems="center" justifyContent="between">
                        <div className="mr-3 mt-2">
                            {data.Battery.Plugged === Plugged._AC
                                ? <img src={`${process.env.PUBLIC_URL}/img/diagnostic/charging.svg`} width={30} />
                                : data.Battery.Plugged === Plugged._USB
                                    ? <img src={`${process.env.PUBLIC_URL}/img/diagnostic/connect.svg`} width={30} />
                                    : <img src={`${process.env.PUBLIC_URL}/img/diagnostic/wireless-charging.svg`} width={30} />
                            }
                        </div>
                        <Progress percent={data.Battery.Level}
                            status={
                                data.Battery.Status === Status._CHARGING ? "active" : "normal"
                            } />
                    </Flex>
                ) : (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)}
            </div>
            <div className="mt-5">
                <h4 className="mb-2">Health</h4>
                {data.Battery ? (
                    <span>Your device is {healthCheck(data.Battery.Health)}</span>
                ) : (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)}
            </div>
            <div className="mt-5">
                <h4 className="mb-2">Memory</h4>
                {data.Memory ? (
                    <div style={{ position: 'relative' }}>
                        <div style={{ width: "100%", position: "absolute", top: "50%", left: 0, marginTop: "-8px", lineHeight: '19px', textAlign: "center", zIndex: 9999 }}>
                            Installed
                            <span style={{ display: 'block' }}>
                                {data.Memory.Installed}
                            </span>
                        </div>
                        <Doughnut width={250} data={
                            {

                                labels: ['Free', 'Used'],
                                datasets: [
                                    {
                                        data: [
                                            parseFloat(data.Memory.Free.replace(/^D\+/g, "")),
                                            parseFloat(data.Memory.Used.replace(/^D\+/g, ""))],
                                        backgroundColor: [COLOR_4, COLOR_2],
                                        pointBackgroundColor: [COLOR_4, COLOR_2]
                                    }
                                ]
                            }
                        } />
                    </div>
                ) : (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)}
            </div>
        </Drawer>
    );
}

export default DeviceView;