import * as React from "react";
import { Col, Row, Modal, Button, Input, message, Form, Card } from "antd";
import { useState, useEffect } from "react";
import { IMarketAppList } from "../../../../api/types.response";
import CardToolbar from "../../../../components/util-components/DemoCard/CardToolbar";
import { AppService } from "../../../../api";
import Localization from "../../../../utils/Localization";
import { DONE, UPDATING, UPLOADING } from "../../../../constants/Messages";
import WithStringTranslate from "../../../../utils/translate";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";

const Integration = ({ appData }: { appData: IMarketAppList }) => {
  const { confirm } = Modal;
  const { ModuleSettings: settings } = appData;
  const [form] = Form.useForm();
  const [activationCode, setActivationCode] = useState<any>();
  const [apiKey, setApiKey] = useState<string>();
  const [backOfficeURI, setBackOfficeURI] = useState<any>("");
  const [ExternalSecurityPolicy, setExternalSecurityPolicy] = useState<any>("");
  useEffect(() => {
    setActivationCode(appData.LicenseActivationCode);
    setApiKey(appData.ApyKey);
    setBackOfficeURI(appData!.BackOfficeURI);
    try {
      setExternalSecurityPolicy(
        JSON.parse(window.atob(appData!.ExternalSecurityPolicy.toString()))
      );
    } catch {
      setExternalSecurityPolicy({ CustomerID: null, PublicKey: null });
    }
  }, []);
  const generateActivationCode = () => {
    confirm({
      title: "Are you sure you want generate a new activation code?",
      onOk: () =>
        new AppService()
          .GenerateLicenseActivationCode(appData.ID)
          .then((data) => {
            if (data) {
              if (data.ErrorCode === 0) {
                setActivationCode(data.ActivationCode);
                //message
                //.loading({
                //content: <Localization msg={UPDATING} />,
                //key: "updatable",
                //})
                //.then(() => {
                //setActivationCode(data.ActivationCode);
                //})
                //.then(() =>
                //message.success({
                //content: <Localization msg={DONE} />,
                //duration: 1,
                //})
                //);
              }
            }
          }),
      onCancel: () => {},
    });
  };

  const generateApiKey = () => {
    confirm({
      title: "Are you sure you want to generate a new API Key?",
      onOk: async () => {
        return await new AppService()
          .GenerateApiKey(appData!.ID)
          .then((data) => {
            if (data) {
              if (data.ErrorCode === 0) {
                setApiKey(data.ApiKey);
                //message
                //.loading({
                //content: WithStringTranslate(UPLOADING),
                //key: "updatable",
                //})
                //.then(() => {
                //setApiKey(data.ApiKey);
                //})
                //.then(() =>
                //message.success({
                //content: <Localization msg={DONE} />,
                //duration: 1,
                //})
                //);
              }
            }
          });
      },
    });
  };
  const deleteApiKey = () => {
    confirm({
      title: "Are you sure you want to delete current API Key?",
      onOk: () =>
        new AppService().DeleteApiKey(appData!.ID).then((data) => {
          if (data) {
            if (data.ErrorCode === 0) {
              setApiKey("00000000-0000-0000-0000-000000000000");
              //message
              //.loading({
              //content: <Localization msg={UPDATING} />,
              //key: "updatable",
              //})
              //.then(() => {
              //setApiKey("00000000-0000-0000-0000-000000000000");
              //})
              //.then(() =>
              //message.success({
              //content: <Localization msg={DONE} />,
              //duration: 1,
              //})
              //);
            }
          }
        }),
      onCancel: () => {},
    });
  };

  const updateCredentials = (data: any) => {
    message
      .loading({
        content: WithStringTranslate(UPDATING),
        key: "updatable",
        duration: 1,
      })
      .then(() => {
        return new AppService()
          .UpdateApp({ AppID: appData.ID, ...data })
          .then((data) => {
            if (data) {
              if (data.ErrorCode === 0) {
                message.success({
                  content: WithStringTranslate(DONE),
                  duration: 1,
                });
              }
            }
          });
      });
  };

  const onExternalSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExternalSecurityPolicy((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Row gutter={ROW_GUTTER}>
      <Col xl={12} className={settings.APIKey ? "mb-4" : "mb-4 d-none"}>
        <div className="container-fluid">
          <h2>API Key</h2>
        </div>
        <Input
          disabled
          value={apiKey}
          suffix={
            <CardToolbar code={apiKey} expand={() => false} isExpand="false" />
          }
        />
        <Button type="ghost" className="mt-3" onClick={() => generateApiKey()}>
          <IntlMessage id="app.Generate" />
        </Button>
        <Button danger className="mt-3 ml-3" onClick={() => deleteApiKey()}>
          <IntlMessage id="app.Delete" />
        </Button>
      </Col>
      <Col xl={12} className={settings.ActivationCode ? "mb-4" : "mb-4 d-none"}>
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
      <Col xl={12} className={settings.Backoffice ? "mb-4" : "mb-4 d-none"}>
        <div className="container-fluid">
          <h2>Back Office URI</h2>
        </div>
        <Input
          value={backOfficeURI}
          name="BackOfficeURI"
          onChange={(e) => setBackOfficeURI(e.currentTarget.value)}
          suffix={
            <CardToolbar
              code={backOfficeURI}
              expand={() => false}
              isExpand="false"
            />
          }
        />
        <Button
          type="ghost"
          htmlType="submit"
          className="mt-3"
          onClick={() =>
            updateCredentials({
              ExternalSecurityPolicy: Buffer.from(
                JSON.stringify(ExternalSecurityPolicy)
              ).toString("base64"),
            })
          }
        >
          <IntlMessage id="app.Refresh" />
        </Button>
      </Col>
      <Col xl={12} className={settings.RSAKey ? "mb-4" : "mb-4 d-none"}>
        <div className="container-fluid">
          <h2>Customer ID</h2>
        </div>
        <Input
          name="CustomerID"
          onChange={onExternalSecurityChange}
          value={ExternalSecurityPolicy.CustomerID}
          suffix={
            <CardToolbar
              code={ExternalSecurityPolicy.CustomerID}
              expand={() => false}
              isExpand="false"
            />
          }
        />
        <Button
          type="ghost"
          htmlType="submit"
          onClick={() =>
            updateCredentials({
              ExternalSecurityPolicy: Buffer.from(
                JSON.stringify(ExternalSecurityPolicy)
              ).toString("base64"),
            })
          }
          className="mt-3"
        >
          <IntlMessage id="app.Refresh" />
        </Button>
      </Col>
      <Col xl={12} className={settings.RSAKey ? "mb-4" : "mb-4 d-none"}>
        <div className="container-fluid">
          <h2>Public key</h2>
        </div>
        <Input
          name="PublicKey"
          value={ExternalSecurityPolicy.PublicKey}
          onChange={onExternalSecurityChange}
          suffix={
            <CardToolbar
              code={ExternalSecurityPolicy.PublicKey}
              expand={() => false}
              isExpand="false"
            />
          }
        />
        <Button type="ghost" htmlType="submit" className="mt-3">
          <IntlMessage id="app.Refresh" />
        </Button>
      </Col>
    </Row>
  );
};

export default Integration;
