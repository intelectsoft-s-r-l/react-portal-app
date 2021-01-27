import React, { useContext, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppService } from "../../../../../../api";
import Loading from "../../../../../../components/shared-components/Loading";
import { hideLoading, showLoading } from "../../../../../../redux/actions/Auth";
import { IState } from "../../../../../../redux/reducers";
import { MarketContext } from "../../MarketContext";
import FinalWizard from "./AppInstalled";

const FinalStep = () => {
  const { selectedApp, loading } = useContext(MarketContext);
  const [isInstalled, setIsInstalled] = useState<boolean>(true);
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    dispatch(showLoading());
    setTimeout(async () => {
      return await new AppService().ActivateApp(selectedApp.ID).then((data) => {
        if (data && data.ErrorCode === 0) {
          setIsInstalled(true);
        } else {
          setIsInstalled(false);
        }
      });
    }, 2500);
  }, []);
  return (
    <>{loading ? <Loading /> : <FinalWizard isInstalled={isInstalled} />}</>
  );
};

export default FinalStep;
