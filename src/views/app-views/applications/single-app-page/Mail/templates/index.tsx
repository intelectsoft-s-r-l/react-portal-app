import React, { useState, useEffect } from "react";
import { Button, Card, Empty, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ITemplate } from "../../../../../../api/mail/types";
import { MailService } from "../../../../../../api/mail";
import { templatesTable } from "./templatesTable";
import { EnErrorCode } from "../../../../../../api/HttpService";
import { RouteComponentProps } from "react-router-dom";
import CreateTemplateModal from "./CreateTemplateModal";
import Flex from "../../../../../../components/shared-components/Flex";
interface ITemplates extends RouteComponentProps {
  APIKey: string;
}
const Templates = (props: ITemplates) => {
  const instance = new MailService();
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [isCreate, setIsCreate] = useState(false);
  const getTemplates = async () => {
    return await instance.GetTemplates(props.APIKey).then((data) => {
      if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
        setTemplates(data.Templates);
      }
    });
  };
  useEffect(() => {
    getTemplates();
    return () => instance._source.cancel();
  }, []);
  return (
    <>
      <CreateTemplateModal
        APIKey={props.APIKey}
        visible={isCreate}
        close={() => setIsCreate(false)}
        getTemplates={getTemplates}
      />
      <Flex justifyContent="between" alignItems="center" className="mb-4">
        <h2>Templates</h2>
        {templates.length > 0 && (
          <Button type="primary">
            <PlusOutlined />
            <span>New</span>
          </Button>
        )}
      </Flex>
      <Card>
        <Table
          dataSource={templates}
          columns={templates.length > 0 ? templatesTable() : undefined}
          locale={{
            emptyText: (
              <Empty
                image={process.env.PUBLIC_URL + "/img/list.svg"}
                description={
                  <span>
                    No templates just yet. <p>Let's make one!</p>
                  </span>
                }
              >
                <Button type="primary" onClick={() => setIsCreate(true)}>
                  Create now
                </Button>
              </Empty>
            ),
          }}
        />
      </Card>
    </>
  );
};

export default Templates;
