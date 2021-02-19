import React, { useEffect, useState } from "react";
import { Empty } from "antd";
import Flex from "../../../../components/shared-components/Flex";
import Loading from "../../../../components/shared-components/Loading";
import { AppService } from "../../../../api/app";
import Utils from "../../../../utils";
import { IMarketAppList } from "../../../../api/app/types";
import { EnStatusApp } from "../single-app-page";
import Applications from "..";
const MyAppList = () => {
  const instance = new AppService();
  const [apps, setApps] = useState<IMarketAppList[]>([]);
  const [appsToSearch, setAppsToSearch] = useState<IMarketAppList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const getMarketAppList = async () => {
    return instance.GetMarketAppList().then((data) => {
      setLoading(false);
      if (data && data.ErrorCode === 0) {
        const activeApps = data.MarketAppList.filter(
          (marketApp: IMarketAppList) => marketApp.Status === EnStatusApp.ACTIVE
        );
        setApps(Utils.sortData(activeApps, "ID"));
        setAppsToSearch(Utils.sortData(activeApps, "ID"));
      }
    });
  };

  useEffect(() => {
    getMarketAppList();
    return () => instance._source.cancel();
  }, []);

  if (loading) return <Loading />;
  if (!apps) {
    return (
      <Flex justifyContent="center" className="w-100">
        <Empty />
      </Flex>
    );
  }

  return (
    <>
      <Applications
        loading={loading}
        data={apps}
        getMarketApps={getMarketAppList}
        setData={setApps}
        dataToSearch={appsToSearch}
      />
    </>
  );
};

export default MyAppList;
