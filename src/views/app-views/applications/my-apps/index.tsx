import React, { useEffect, useMemo, useState } from "react";
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
        setApps(data.MarketAppList);
        setAppsToSearch(data.MarketAppList);
      }
    });
  };
  const sortedApps = useMemo(() => {
    const activeApps = apps.filter(
      (marketApp: IMarketAppList) => marketApp.Status === EnStatusApp.ACTIVE
    );
    return Utils.sortData(activeApps, "ID");
  }, [apps]);

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
        data={sortedApps}
        getMarketApps={getMarketAppList}
        setData={setApps}
        dataToSearch={appsToSearch}
      />
    </>
  );
};

export default MyAppList;
