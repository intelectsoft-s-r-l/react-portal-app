import React from "react";
import { Card, Avatar } from "antd";
import Flex from "../Flex";
import CustomStatistic from "../CustomStatistic";

interface DataDisplayWidgetProps {
    size?: string | number;
    value?: any;
    title?: any;
    icon?: any;
    color?: any;
    avatarSize?: number;
    vertical?: boolean;
}

export interface ICustomStatistic {
    size?: string;
    title?: string;
    value?: string | number;
}

const DataDisplayWidget: React.FC<DataDisplayWidgetProps> = (props) => {
    const { size, value, title, icon, color, avatarSize, vertical } = props;
    const customStatisticProps = {
        size,
        value,
        title,
    } as ICustomStatistic;
    return (
        <Card>
            <Flex
                alignItems="center"
                flexDirection={vertical ? "column" : "row"}
            >
                <Avatar
                    size={avatarSize}
                    shape="square"
                    icon={icon}
                    className={`ant-avatar-${color}`}
                />
                <div className={vertical ? "mt-3 text-center" : "ml-3"}>
                    <CustomStatistic {...customStatisticProps} />
                </div>
            </Flex>
        </Card>
    );
};

export default DataDisplayWidget;
