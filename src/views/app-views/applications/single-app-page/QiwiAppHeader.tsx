import { Button, Col, Form, Input, message, Row } from "antd";
import * as React from "react";
import { ClientApi } from "../../../../api";
import { IUpdateAppRequest } from "../../../../api/types.request";
import { PageHeaderAlt } from "../../../../components/layout-components/PageHeaderAlt";
import CardToolbar from "../../../../components/util-components/DemoCard/CardToolbar";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { DONE } from "../../../../constants/Messages";
import WithStringTranslate from "../../../../utils/translate";

interface IQiwiAppHeader {
  AppID: number;
  BackOfficeURI?: any;
  ExternalSecurityPolicy?: any;
  setExternalSecurityPolicy: any;
}
const QiwiAppHeader = ({
  AppID,
  BackOfficeURI,
  ExternalSecurityPolicy,
  setExternalSecurityPolicy,
}: IQiwiAppHeader) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const updateApp = async (info: IUpdateAppRequest) => {
    return new ClientApi().UpdateApp(info).then((data) => {
      setLoading(false);
      if (data) {
        if (data.ErrorCode === 0) {
          message.success(WithStringTranslate(DONE), 1);
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
      <Form>
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
        </Row>
        <Row className="mt-3">
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
      </Form>
    </PageHeaderAlt>
  );
};

export default QiwiAppHeader;
