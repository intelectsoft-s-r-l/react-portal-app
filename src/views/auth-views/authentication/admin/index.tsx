import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../../../configs/AppConfig";
import { MANAGE_TOKEN } from "../../../../constants/ApiConstant";
import Utils from "../../../../utils";
import { useQuery } from "../../../../utils/hooks/useQuery";

const Admin = (props: RouteComponentProps) => {
  const query = useQuery();
  useEffect(() => {
    if (query.get("token") && query.get("company_id")) {
      // Pass company_id here ManageToken_{company_id}
      sessionStorage.setItem("c_id", query.get("company_id")!);
      Utils.setManageToken(
        `${MANAGE_TOKEN}_${query.get("company_id")}`,
        query.get("token")
      );
      props.history.push(APP_PREFIX_PATH);
    }
  }, []);
  return <div>Loading...</div>;
};
export default Admin;
