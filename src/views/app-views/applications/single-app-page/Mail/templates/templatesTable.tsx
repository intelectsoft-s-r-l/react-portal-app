import { ColumnsType } from "antd/es/table/interface";
import { ITemplate } from "../../../../../../api/mail/types";

export const templatesTable = () => {
  const tableColumns: ColumnsType<ITemplate> = [
    {
      title: "ID",
      dataIndex: "ID",
    },
    {
      title: "Name",
      dataIndex: "Name",
    },
    {
      title: "State",
      dataIndex: "State",
    },
    {
      title: "Subject",
      dataIndex: "Subject",
    },
  ];
  return tableColumns;
};
