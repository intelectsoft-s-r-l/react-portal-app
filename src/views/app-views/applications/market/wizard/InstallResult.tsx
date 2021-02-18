import React, { useContext, useLayoutEffect, useState } from "react";
import { Result } from "antd";
import { AppService } from "../../../../../api/app";
import Loading from "../../../../../components/shared-components/Loading";
import TranslateText from "../../../../../utils/translate";
import { MarketContext } from "../MarketContext";

const InstallResult = () => {
  const { state, dispatch, getMarketApps } = useContext(MarketContext);
  const [isInstalled, setIsInstalled] = useState<boolean>(true);
  useLayoutEffect(() => {
    dispatch({ type: "SHOW_LOADING" });
    setTimeout(async () => {
      return await new AppService()
        .ActivateApp(state.selectedApp.ID)
        .then((data) => {
          if (data && data.ErrorCode === 0) {
            setIsInstalled(true);
            getMarketApps();
          } else {
            setIsInstalled(false);
          }
        });
    }, 2500);
  }, []);
  if (state.wizLoading) return <Loading />;
  return (
    <Result
      status={isInstalled ? "success" : "error"}
      title={
        isInstalled
          ? TranslateText("wizard.install.success.title")
          : TranslateText("wizard.install.error.title")
      }
      subTitle={
        isInstalled
          ? TranslateText("wizard.install.success.content")
          : TranslateText("message.Error")
      }
    />
  );
};

export default InstallResult;
