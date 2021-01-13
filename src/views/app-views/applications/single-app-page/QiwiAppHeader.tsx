import { Button, Col, Form, Input, message, Row } from "antd";
import * as React from "react";
import { AppService } from "../../../../api";
import { IUpdateAppRequest } from "../../../../api/types.request";
import { PageHeaderAlt } from "../../../../components/layout-components/PageHeaderAlt";
import CardToolbar from "../../../../components/util-components/DemoCard/CardToolbar";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { DONE } from "../../../../constants/Messages";
import TranslateText from "../../../../utils/translate";

interface IQiwiAppHeader {
  AppID: number;
  BackOfficeURI?: any;
  ExternalSecurityPolicy?: any;
  setExternalSecurityPolicy: any;
  apiKey: string;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
  generateApiKey: () => void;
  deleteApiKey: () => void;
}
const QiwiAppHeader = ({
  AppID,
  BackOfficeURI,
  ExternalSecurityPolicy,
  setExternalSecurityPolicy,
  apiKey,
  generateApiKey,
  deleteApiKey,
}: IQiwiAppHeader) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const updateApp = async (info: IUpdateAppRequest) => {
    return new AppService().UpdateApp(info).then((data) => {
      setLoading(false);
      if (data) {
        if (data.ErrorCode === 0) {
          message.success(TranslateText(DONE), 1);
        }
      }
    });
  };
  const onChange = (e: any) => {
    setExternalSecurityPolicy((prevState: any) => ({
      ...prevState,
      [e.currentTarget.name]: e.currentTarget.value,
    }));
  };

  return (
    <PageHeaderAlt className="bg-white border-bottom mb-3">
      <Row justify="space-between">
        <Col xl={8}>
          <div className="container-fluid">
            <h2>Customer ID</h2>
          </div>
          <Input
            value={ExternalSecurityPolicy.CustomerID}
            name={"CustomerID"}
            onChange={onChange}
            suffix={
              <CardToolbar
                code={ExternalSecurityPolicy!.CustomerID}
                expand={() => false}
                isExpand="false"
              />
            }
          />
        </Col>
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
      </Row>
      <Row>
        <Col xl={8}>
          <div className="container-fluid">
            <h2>Public Key</h2>
          </div>
          <Input
            value={ExternalSecurityPolicy!.PublicKey}
            name="PublicKey"
            onChange={onChange}
            suffix={
              <CardToolbar
                code={ExternalSecurityPolicy!.PublicKey}
                expand={() => false}
                isExpand="false"
              />
            }
          />
          <Button
            type="ghost"
            className="mt-3"
            loading={loading}
            onClick={() => {
              setLoading(true);
              setTimeout(async () => {
                return await updateApp({
                  AppID,
                  BackOfficeURI,
                  ExternalSecurityPolicy: Buffer.from(
                    JSON.stringify(ExternalSecurityPolicy)
                  ).toString("base64"),
                });
              }, 1000);
            }}
          >
            {" "}
            <IntlMessage id="auth.Send" />
          </Button>
        </Col>
      </Row>
    </PageHeaderAlt>
  );
};

export default QiwiAppHeader;
