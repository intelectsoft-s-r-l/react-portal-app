import * as React from "react";
import { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { SmsService } from "../../../../../api";
import Flex from "../../../../../components/shared-components/Flex";
import Utils from "../../../../../utils";
interface ISMSList extends RouteComponentProps {
  APIKey: string;
}
const SmsList = (props: ISMSList) => {
  const getSmsList = () =>
    new SmsService()
      .Info_GetDetailByPeriod(
        props.APIKey,
        Utils.handleDotNetDate("01-01-2019"),
        Utils.handleDotNetDate("01-01-2021")
      )
      .then((data) => console.log(data));
  useEffect(() => {
    getSmsList();
  }, []);
  return (
    <Flex className="py-4">
      <h2>SMS List</h2>
    </Flex>
  );
};
export default SmsList;
