import React from "react";
import { ColumnsType } from "antd/es/table/interface";
import { ITemplate } from "../../../../../../api/mail/types";
import Utils from "../../../../../../utils/";
import "./style.scss";
import Tag from "antd/es/tag";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
enum EnState {
  INACTIVE = 0,
  ACTIVE = 1,
  DISABLED = 2,
}
export const templatesTable = (locale: any) => {
  const tableColumns: ColumnsType<ITemplate> = [
    {
      title: "Name",
      dataIndex: "Name",
    },
    {
      title: "Subject",
      dataIndex: "Subject",
      render: (Subject) => (
        <span
          className="subject"
          dangerouslySetInnerHTML={{
            __html: Utils.decodeBase64Locale(Subject) ?? "",
          }}
        ></span>
      ),
    },
    {
      title: "State",
      dataIndex: "State",
      render: (State: number) => (
        <Tag
          className="text-capitalize"
          color={
            State === EnState.ACTIVE
              ? "cyan"
              : State === EnState.DISABLED
              ? "red"
              : "orange"
          }
        >
          {State === EnState.ACTIVE ? (
            <IntlMessage id={"users.status.Active"} />
          ) : State === EnState.DISABLED ? (
            <IntlMessage id={"users.status.Disabled"} />
          ) : (
            <IntlMessage id={"users.status.NotActivated"} />
          )}
        </Tag>
      ),
    },
  ];
  return tableColumns;
};
