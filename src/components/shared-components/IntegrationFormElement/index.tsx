import { Button, Input } from "antd";
import { ButtonType } from "antd/es/button";
import React from "react";
import CardToolbar from "../../util-components/DemoCard/CardToolbar";
import IntlMessage from "../../util-components/IntlMessage";
import Flex from "../Flex";

interface IntegrationFormElement {
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | number;
  hasToolbar?: boolean;
  buttonType?: ButtonType;
  onClickFunc: () => void;
  isDisabled?: boolean;
  title: React.ReactNode | string;
  isFlex?: boolean;
  onDelete?: () => void;
}
const IntegrationFormElement = (props: IntegrationFormElement) => {
  const {
    name,
    onChange,
    value,
    hasToolbar = true,
    buttonType = "ghost",
    onClickFunc,
    isDisabled = false,
    title,
    isFlex = false,
    onDelete,
  } = props;
  return (
    <>
      <div className="container-fluid">
        <h2>{title}</h2>
      </div>
      {isFlex ? (
        <Flex alignItems="center" justifyContent="center">
          <Input
            disabled={isDisabled}
            name={name}
            onChange={onChange}
            value={value}
            suffix={
              hasToolbar && (
                <CardToolbar
                  code={value}
                  expand={() => false}
                  isExpand="false"
                />
              )
            }
          />
          <Button
            type={buttonType}
            onClick={onClickFunc}
            className="ml-3"
            style={{ borderColor: "#1890ff" }}
          >
            <IntlMessage id="app.Refresh" />
          </Button>
          {onDelete && (
            <Button danger onClick={onDelete} className="mt-3 ml-3">
              <IntlMessage id="app.Delete" />
            </Button>
          )}
        </Flex>
      ) : (
        <>
          <Input
            disabled={isDisabled}
            name={name}
            onChange={onChange}
            value={value}
            suffix={
              hasToolbar && (
                <CardToolbar
                  code={value}
                  expand={() => false}
                  isExpand="false"
                />
              )
            }
          />
          <Button type={buttonType} onClick={onClickFunc} className="mt-3">
            <IntlMessage id="app.Refresh" />
          </Button>
          {onDelete && (
            <Button danger onClick={onDelete} className="mt-3 ml-3">
              <IntlMessage id="app.Delete" />
            </Button>
          )}
        </>
      )}
    </>
  );
};

export default IntegrationFormElement;
