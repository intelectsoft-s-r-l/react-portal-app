import * as React from 'react'
import { Drawer } from 'antd'
import { ILicenses } from '../../../../../api/types.response';

interface IDeviceView {
    visible: boolean
    data: ILicenses;
    close: () => void;
}
const DeviceView = ({ visible, data, close }: IDeviceView) => {
    return (
        <Drawer width={500} placement={"right"} onClose={close} closable={true} visible={visible}>
            <h3 className="text-left mt-3">Diagnostic Information</h3>
        </Drawer>
    );
}

export default DeviceView;