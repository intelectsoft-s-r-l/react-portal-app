import React, { useEffect, useState, useReducer } from "react";
import { AppService } from "../../../../api/app";
import Utils from "../../../../utils";
import { IMarketAppList } from "../../../../api/app/types";
import "../applications.scss";
import wizardReducer, { wizardState } from "./wizard/wizardReducer";
import useFetch from "../../../../utils/hooks/useFetch";
import Applications from "..";

const Market = () => {
  const instance = new AppService();
  const [apps, setApps] = useState<IMarketAppList[]>([]);
  const [appsToSearch, setAppsToSearch] = useState<IMarketAppList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [state, dispatch] = useReducer(wizardReducer, wizardState);
  const getMarketApps = async () => {
    return instance.GetMarketAppList().then((data) => {
      if (data && data.ErrorCode === 0) {
        setLoading(false);
        const evaluatedArr = Utils.sortData(data.MarketAppList, "ID");
        setApps(evaluatedArr);
        dispatch({ type: "HIDE_LOADING" });
        setAppsToSearch(evaluatedArr);
      }
    });
  };
  useEffect(() => {
    getMarketApps();
    return () => instance._source.cancel();
  }, []);

  useEffect(() => {
    // Cleanup installation state after closing the installation modal
    if (!state.visibleModal) {
      setTimeout(() => {
        dispatch("");
      }, 250);
    }
  }, [state.visibleModal]);

  //const {
  //loading,
  //data: apps,
  //request: getMarketApps,
  //setData: setApps,
  //optionalData: appsToSearch,
  //} = useFetch(instance, instance.GetMarketAppList());
  //const [app, setApp ] = useState()
  //useEffect(() => {
  //setApp(Utils.sortData(data.MarketAppList, "ID"))
  //}, [])

  return (
    <>
      <Applications
        loading={loading}
        data={apps}
        getMarketApps={getMarketApps}
        setData={setApps}
        dataToSearch={appsToSearch}
      />
    </>
  );
};

export default Market;
