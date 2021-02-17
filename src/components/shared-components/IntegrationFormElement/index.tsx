import { Button, Input } from "antd";
import { ButtonType } from "antd/es/button";
import { LiteralUnion } from "antd/es/_util/type";
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
  inputType?: LiteralUnion<
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week",
    string
  >;
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
    inputType = "text",
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
            autoComplete="false"
            type={inputType}
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
            <Button danger onClick={onDelete} className="ml-3">
              <IntlMessage id="app.Delete" />
            </Button>
          )}
        </Flex>
      ) : (
        <>
          <Input
            disabled={isDisabled}
            name={name}
            autoComplete="false"
            type={inputType}
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
