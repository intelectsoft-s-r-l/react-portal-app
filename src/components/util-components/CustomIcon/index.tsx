import React from "react";
import Icon from "@ant-design/icons";

interface ICustomIcon {
  svg?: any;
  className?: string;
}

const CustomIcon = React.forwardRef(({ svg, className }: ICustomIcon) => (
  <Icon component={svg} className={className} />
));

export default CustomIcon;
