import { Result } from "antd";
import React, { useContext, useLayoutEffect, useState } from "react";
import { AppService } from "../../../../../../api";
import Loading from "../../../../../../components/shared-components/Loading";
import TranslateText from "../../../../../../utils/translate";
import { MarketContext } from "../../MarketContext";

const FinalStep = () => {
  const { selectedApp, wizLoading, setWizLoading } = useContext(MarketContext);
  const [isInstalled, setIsInstalled] = useState<boolean>(true);
  useLayoutEffect(() => {
    setWizLoading(true);
    setTimeout(async () => {
      return await new AppService().ActivateApp(selectedApp.ID).then((data) => {
        setWizLoading(false);
        if (data && data.ErrorCode === 0) {
          setIsInstalled(true);
        } else {
          setIsInstalled(false);
        }
      });
    }, 2500);
  }, []);
  if (wizLoading) return <Loading />;
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

export default FinalStep;
