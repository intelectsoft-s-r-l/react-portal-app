import React, { useContext, useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppService } from "../../../../../../api";
import Loading from "../../../../../../components/shared-components/Loading";
import { showLoading } from "../../../../../../redux/actions/Auth";
import { MarketContext } from "../../MarketContext";
import FinalWizard from "./AppInstalled";

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
  return (
    <>{wizLoading ? <Loading /> : <FinalWizard isInstalled={isInstalled} />}</>
  );
};

export default FinalStep;
