import React from "react";
import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { AppService } from "../../../../api";
import PageHeaderAlt from "../../../../components/layout-components/PageHeaderAlt";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { DONE, UPDATING } from "../../../../constants/Messages";
import CardToolbar from "../../../../components/util-components/DemoCard/CardToolbar";
import WithStringTranslate from "../../../../utils/translate";

const IntegrationsHeader = ({
  apiKey,
  AppID,
  BackOfficeURI,
  activationCode,
  setActivationCode,
  getMarketApp,
  generateApiKey,
  deleteApiKey,
  ExternalSecurityPolicy,
  setExternalSecurityPolicy,
}: any) => {
  const { confirm } = Modal;
  const generateActivationCode = () => {
    confirm({
      title: "Are you sure you want generate a new activation code?",
      onOk: () =>
        new AppService()
          .GenerateLicenseActivationCode(AppID)
          .then((data: any) => {
            if (data) {
              if (data.ErrorCode === 0) {
                message
                  .loading({
                    content: WithStringTranslate(UPDATING),
                    key: "updatable",
                  })
                  .then(() => {
                    setActivationCode(data.ActivationCode);
                  })
                  .then(() =>
                    message.success({
                      content: WithStringTranslate(DONE),
                      key: "updatable",
                      duration: 1,
                    })
                  );
              }
            }
          }),
      onCancel: () => {},
    });
  };

  const updateBackOfficeURI = ({
    BackOfficeURI,
  }: {
    BackOfficeURI: string;
  }) => {
    message.loading({
      content: WithStringTranslate(UPDATING),
      key: "updatable",
    });
    setTimeout(() => {
      return new AppService()
        .UpdateApp({ AppID, BackOfficeURI })
        .then((data: any) => {
          if (data) {
            if (data.ErrorCode === 0) {
              getMarketApp().then(() =>
                message.success({
                  content: WithStringTranslate(DONE),
                  key: "updatable",
                  duration: 1,
                })
              );
            }
          }
        });
    }, 1500);
  };
  return (
    <PageHeaderAlt className="bg-white border-bottom mb-3">
      <Row justify="space-between">
        <Col xl={8}>
          <div className="container-fluid">
            <h2>API Key</h2>
          </div>
          <Input
            disabled
            value={apiKey}
            suffix={
              <CardToolbar
                code={apiKey}
                expand={() => false}
                isExpand="false"
              />
            }
          />
          <Button
            type="ghost"
            className="mt-3"
            onClick={() => generateApiKey()}
          >
            <IntlMessage id="app.Generate" />
          </Button>
          <Button danger className="mt-3 ml-3" onClick={() => deleteApiKey()}>
            <IntlMessage id="app.Delete" />
          </Button>
        </Col>
        <Col xl={8}>
          <div className="container-fluid">
            <h2>Activation Code</h2>
          </div>
          <Input
            disabled
            value={activationCode}
            suffix={
              <CardToolbar
                code={activationCode}
                expand={() => false}
                isExpand="false"
              />
            }
          />
          <Button
            type="ghost"
            className="mt-3"
            onClick={() => generateActivationCode()}
          >
            <IntlMessage id="app.Refresh" />
          </Button>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col xl={8}>
          <Form
            onFinish={updateBackOfficeURI}
            initialValues={{ BackOfficeURI }}
          >
            <div className="container-fluid">
              <h2>Back Office URI</h2>
            </div>
            <Form.Item
              name="BackOfficeURI"
              rules={[
                {
                  required: true,
                  message: "Please insert URI!",
                },
              ]}
            >
              <Input
                suffix={
                  <CardToolbar
                    code={BackOfficeURI}
                    expand={() => false}
                    isExpand="false"
                  />
                }
              />
            </Form.Item>
            <Button type="ghost" htmlType="submit">
              <IntlMessage id="app.Refresh" />
            </Button>
          </Form>
        </Col>
      </Row>
    </PageHeaderAlt>
  );
};

export default IntegrationsHeader;
