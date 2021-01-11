import * as React from "react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { SmsService } from "../../../../../api";
import Flex from "../../../../../components/shared-components/Flex";
import moment from "moment";
import Loading from "../../../../../components/shared-components/Loading";
interface ISMSList extends RouteComponentProps {
  APIKey: string;
}
const SmsList = (props: ISMSList) => {
  const [loading, setLoading] = useState<boolean>(true);
  const getSmsList = async () =>
    await new SmsService()
      .Info_GetDetailByPeriod(
        props.APIKey,
        moment("2019-01-01").valueOf() * 10000 + 621355968000000000,
        moment("2021-01-01").valueOf() * 10000 + 621355968000000000
      )
      .then((data) => {
        console.log(data);
        if (data && data.ErrorCode === 0) {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));

  const getInfoTotal = async () =>
    await new SmsService().Info_GetTotal(props.APIKey).then((data) => {
      console.log(data);
    });

  const getInfoByPeriod = async () =>
    await new SmsService()
      .Info_GetByPeriod(
        props.APIKey,
        moment("2019-01-01").valueOf() * 10000 + 621355968000000000,
        moment("2021-01-01").valueOf() * 10000 + 621355968000000000
      )
      .then((data) => console.log(data));

  useEffect(() => {
    getInfoTotal();
  }, []);
  if (loading) {
    return <Loading cover="content" />;
  }
  return (
    <Flex className="py-4">
      <h2>SMS List</h2>
    </Flex>
  );
};
export default SmsList;
