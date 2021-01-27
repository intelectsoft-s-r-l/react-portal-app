import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export interface ILoading {
  align?: string;
  cover?: string;
}

const Icon = <LoadingOutlined style={{ fontSize: 35 }} spin />;

const Loading = (props: ILoading) => {
  const { align = "center", cover = "content" } = props;
  return (
    <div className={`loading text-${align} cover-${cover}`}>
      <Spin indicator={Icon} />
    </div>
  );
};

export default Loading;
