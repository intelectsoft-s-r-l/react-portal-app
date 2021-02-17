import React, { useState, useEffect } from "react";
import { Button, Card, Empty, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ITemplate } from "../../../../../../api/mail/types";
import { MailService } from "../../../../../../api/mail";
import { templatesTable } from "./templatesTable";
import { EnErrorCode } from "../../../../../../api/";
import { RouteComponentProps } from "react-router-dom";
import CreateTemplateModal from "./CreateTemplateModal";
import Flex from "../../../../../../components/shared-components/Flex";
import { useSelector } from "react-redux";
import { IState } from "../../../../../../redux/reducers";
interface ITemplates extends RouteComponentProps {
  APIKey: string;
}
const Templates = (props: ITemplates) => {
  const instance = new MailService();
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const locale = useSelector((state: IState) => state.theme?.locale);
  const [isCreate, setIsCreate] = useState(false);
  const getTemplates = async () => {
    setLoading(true);
    return await instance.GetTemplates(props.APIKey).then((data) => {
      setLoading(false);
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
          <Button type="primary" onClick={() => setIsCreate(true)}>
            <PlusOutlined />
            <span>New</span>
          </Button>
        )}
      </Flex>
      <Card>
        <Table
          loading={loading}
          rowKey="ID"
          dataSource={templates}
          columns={templates.length > 0 ? templatesTable(locale) : undefined}
          locale={{
            emptyText: !loading && (
              <Empty
                image={process.env.PUBLIC_URL + "/img/list.svg"}
                description={
                  <span>
                    No templates just yet. <br />
                    Let's make one!
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
