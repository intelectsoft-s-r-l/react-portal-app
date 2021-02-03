import * as React from "react";
import { useState, useEffect } from "react";
import { Col, Row, Modal, Button, Input, message, Form, Empty } from "antd";
import { IMarketAppList } from "../../../../api/app/app.types";
import CardToolbar from "../../../../components/util-components/DemoCard/CardToolbar";
import { AppService } from "../../../../api/app";
import { DONE, UPDATING } from "../../../../constants/Messages";
import TranslateText from "../../../../utils/translate";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import Flex from "../../../../components/shared-components/Flex";
import Loading from "../../../../components/shared-components/Loading";

enum key {
  PRIVATE = 1,
  PUBLIC = 2,
}
const Integration = ({
  currentApp,
}: {
  currentApp: Partial<IMarketAppList>;
}) => {
  const instance = new AppService();
  const { confirm } = Modal;
  const [appData, setApp] = useState<Partial<IMarketAppList>>();
  const [form] = Form.useForm();
  const [activationCode, setActivationCode] = useState<number>(0);
  const [apiKey, setApiKey] = useState<string>("");
  const [PublicKey, setPublicKey] = useState<string>("");
  const [PrivateKey, setPrivateKey] = useState<string>("");
  const [backOfficeURI, setBackOfficeURI] = useState<string>("");
  const [ExternalSecurityPolicy, setExternalSecurityPolicy] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(true);
  const getMarketApp = async () => {
    return await instance.GetMarketAppList().then((data) => {
      if (data && data.ErrorCode === 0) {
        setLoading(false);
        const app = data.MarketAppList.find(
          (app) => app.AppType === currentApp!.AppType
        );
        setApp(app);
        setActivationCode(app!.LicenseActivationCode ?? 0);
        setApiKey(app!.ApyKey ?? "");
        setBackOfficeURI(app!.BackOfficeURI ?? "");
        setPublicKey(app!.EncryptionPublicKey ?? "");
        setPrivateKey(app!.EncryptionPrivateKey ?? "");
        try {
          setExternalSecurityPolicy(
            JSON.parse(window.atob(app!.ExternalSecurityPolicy.toString()))
          );
        } catch {
          setExternalSecurityPolicy({ CustomerID: null, PublicKey: null });
        }
      }
    });
  };
  useEffect(() => {
    getMarketApp();
    return () => instance._source.cancel();
  }, []);
  const generateActivationCode = () => {
    confirm({
      title: "Are you sure you want generate a new activation code?",
      onOk: async () =>
        await instance
          .GenerateLicenseActivationCode(appData!.ID ?? 0)
          .then((data) => {
            if (data && data.ErrorCode === 0) {
              setActivationCode(data.ActivationCode);
            }
          }),
      onCancel: () => {},
    });
  };

  const generateApiKey = () => {
    confirm({
      title: "Are you sure you want to generate a new API Key?",
      onOk: async () =>
        await instance.GenerateApiKey(appData!.ID ?? 0).then((data) => {
          if (data && data.ErrorCode === 0) {
            setApiKey(data.ApiKey);
          }
        }),
    });
  };
  const deleteApiKey = () => {
    confirm({
      title: "Are you sure you want to delete current API Key?",
      onOk: async () =>
        await instance.DeleteApiKey(appData!.ID ?? 0).then((data) => {
          if (data && data.ErrorCode === 0) {
            setApiKey("00000000-0000-0000-0000-000000000000");
          }
        }),
      onCancel: () => {},
    });
  };

  const updateCredentials = async (data: any) => {
    message.loading({
      content: TranslateText(UPDATING),
      key: "updatable",
      duration: 1,
    });
    return instance.UpdateApp({ AppID: appData!.ID, ...data }).then((data) => {
      if (data && data.ErrorCode === 0) {
        message.success({
          content: TranslateText(DONE),
          key: "updatable",
          duration: 1,
        });
      }
    });
  };

  const onExternalSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExternalSecurityPolicy((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const generateRsaKey = async () => {
    confirm({
      title: "Are you sure you want to generate new Public and Private Keys?",
      onOk: async () =>
        await instance.GenerateRsaKey(appData!.ID ?? 0).then((data) => {
          if (data && data.ErrorCode === 0) {
            message.success(TranslateText(DONE));
            setPublicKey(data.EncryptionPublicKey);
            setPrivateKey(data.EncryptionPrivateKey);
          }
        }),
    });
  };

  const updateRsaKey = async (AppID: number, Key: string, KeyType: number) => {
    message.loading({
      content: TranslateText(UPDATING),
      key: "updatable",
      duration: 1,
    });
    return instance.UpdateRsaKey(AppID, Key, KeyType).then((data) => {
      if (data && data.ErrorCode === 0) {
        message.success({
          content: TranslateText(DONE),
          key: "updatable",
          duration: 1,
        });
        setPublicKey(data.EncryptionPublicKey);
        setPrivateKey(data.EncryptionPrivateKey);
      }
    });
  };
  if (loading) {
    return <Loading cover="content" />;
  }
  if (!appData) {
    return <Empty />;
  }
  return (
    <Row gutter={ROW_GUTTER} justify="space-between">
      <Col
        xl={12}
        className={appData!.ModuleSettings!.APIKey ? "mb-4" : "mb-4 d-none"}
        style={{ maxWidth: 500 }}
      >
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
      <Col
        xl={12}
        className={
          appData!.ModuleSettings!.ActivationCode ? "mb-4" : "mb-4 d-none"
        }
        style={{ maxWidth: 500 }}
      >
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
      <Col
        xl={12}
        className={appData!.ModuleSettings!.Backoffice ? "mb-4" : "mb-4 d-none"}
        style={{ maxWidth: 500 }}
      >
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
              BackOfficeURI: backOfficeURI,
            })
          }
        >
          <IntlMessage id="app.Refresh" />
        </Button>
      </Col>
      <Col
        xl={12}
        className={appData!.AppType === 100 ? "mb-4" : "mb-4 d-none"}
        style={{ maxWidth: 500 }}
      >
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
      <Row gutter={ROW_GUTTER}>
        <Col
          xl={24}
          className={appData!.ModuleSettings!.RSAKey ? "mb-4" : "mb-4 d-none"}
        >
          {appData!.ModuleSettings!.Backoffice ||
          appData!.ModuleSettings!.ActivationCode ||
          appData!.ModuleSettings!.APIKey ? (
            <hr />
          ) : null}
          <div className="container-fluid">
            <h2>Public Key</h2>
          </div>
          <Flex alignItems="center">
            <Input
              name="PublicKey"
              value={PublicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              suffix={
                <CardToolbar
                  code={PublicKey}
                  expand={() => false}
                  isExpand="false"
                />
              }
            />
            <Button
              type="ghost"
              style={{ borderColor: "#1890ff" }}
              className="ml-3 px-4"
              onClick={() =>
                updateRsaKey(appData!.ID ?? 0, PublicKey, key.PUBLIC)
              }
            >
              <IntlMessage id="app.Refresh" />
            </Button>
          </Flex>
        </Col>
        <Col
          xl={24}
          className={appData!.ModuleSettings!.RSAKey ? "mb-4" : "mb-4 d-none"}
        >
          <div className="container-fluid">
            <h2>Private Key</h2>
          </div>
          <Flex alignItems="center">
            <Input
              name="PrivateKey"
              value={PrivateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
            />
            <Button
              type="ghost"
              style={{ borderColor: "#1890ff" }}
              className="ml-3 px-4"
              onClick={() =>
                updateRsaKey(appData!.ID ?? 0, PrivateKey, key.PRIVATE)
              }
            >
              <IntlMessage id="app.Refresh" />
            </Button>
          </Flex>
          <Button
            type="primary"
            className="mt-4 px-5"
            onClick={() => generateRsaKey()}
          >
            <IntlMessage id="app.Generate" />
          </Button>
        </Col>
      </Row>
    </Row>
  );
};

export default Integration;
