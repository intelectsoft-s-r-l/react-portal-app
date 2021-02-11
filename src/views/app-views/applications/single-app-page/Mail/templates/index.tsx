import React, { useState, useEffect } from "react";
import { Card, Table } from "antd";
import { ITemplate } from "../../../../../../api/mail/types";
import { MailService } from "../../../../../../api/mail";
import { templatesTable } from "./templatesTable";
import { EnErrorCode } from "../../../../../../api/HttpService";
import { RouteComponentProps } from "react-router-dom";
interface ITemplates extends RouteComponentProps {
  APIKey: string;
}
const Templates = (props: ITemplates) => {
  const instance = new MailService();
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  useEffect(() => {
    instance.GetTemplates(props.APIKey).then((data) => {
      if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
        setTemplates(data.Templates);
      }
    });
    return () => instance._source.cancel();
  }, []);
  return (
    <>
      <h2 className="mb-4">Templates</h2>
      <Card title="List of templates">
        <Table dataSource={templates} columns={templatesTable()} />
      </Card>
    </>
  );
};

export default Templates;
