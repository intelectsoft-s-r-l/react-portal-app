import React, { useContext, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppService } from "../../../../../../api";
import Loading from "../../../../../../components/shared-components/Loading";
import { hideLoading, showLoading } from "../../../../../../redux/actions/Auth";
import { IState } from "../../../../../../redux/reducers";
import { MarketContext } from "../../MarketContext";
import FinalWizard from "./AppInstalled";

const FinalStep = () => {
  const {
    selectedApp,
    getMarketApps,
    wizardLoading,
    setWizardLoading,
  } = useContext(MarketContext);
  const [isInstalled, setIsInstalled] = useState<boolean>(true);
  useLayoutEffect(() => {
    setWizardLoading(true);
    setTimeout(() => {
      return new AppService().ActivateApp(selectedApp.ID).then((data) => {
        if (data && data.ErrorCode === 0) {
          setWizardLoading(false);
          setIsInstalled(true);
        } else {
          setIsInstalled(false);
        }
      });
    }, 2500);
  }, []);
  return (
    <>
      {wizardLoading ? <Loading /> : <FinalWizard isInstalled={isInstalled} />}
    </>
  );
};

export default FinalStep;
