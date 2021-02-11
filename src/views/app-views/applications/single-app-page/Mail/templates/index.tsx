import React, { useState, useEffect } from "react";
import { Card, Table } from "antd";
import { ITemplate } from "../../../../../../api/mail/types";
import { MailService } from "../../../../../../api/mail";

const Templates = ({ APIKey }: { APIKey: string }) => {
  const instance = new MailService();
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  useEffect(() => {
    instance.GetTemplates(APIKey).then((data) => {
      if (data && data.ErrorCode === 0) {
        setTemplates(data.Templates);
      }
    });
    return () => instance._source.cancel();
  }, []);
  return (
    <>
      <h2 className="mb-4">Templates</h2>
      <Card title="List of templates">
        <Table dataSource={templates} />
      </Card>
    </>
  );
};

export default Templates;
